import { client, Model } from '../index';
import { Schema, SchemaHelper, Error } from './schema';
import * as Rx from 'rxjs';

class ValidationError extends Error {
  message: string;
  name: string = 'ValidationError';

  constructor(error: any, message: string) {
    super(error);
    this.message = message;
  }
}

/*
     Entity class is the object that will be instantiated with the DB response row data
       Entity holds it's cooresponding schema's current state and the item properties that is passed into it
       Entity has two basic functions, save() and remove() to UPDATE or DELETE the row it's properties relates to
 */
export class Entity extends Schema {
  public toJSON: Function;
  private modified: Object = {};
  public attributes: Object = {};
  private schemaHelper: SchemaHelper;

  constructor(item: any, parent: Model, options?: Object) {
    // super will be the Schema class with all defined event functions
    super(parent.schema);
    delete this.id;
    this.model = parent;
    // remove all exploitable properties from the item
    // when passed back through express response
    this.toJSON = function() {
      delete this.model;
      delete this.validationObs;
      delete this.requireObs;
      delete this.schemaHelper;
      delete this.modified;
      delete this.attributes;
      return this;
    };

    this.schemaHelper = parent.schemaHelper;
    // create class properties cooresponding to column values
    this.integrateItem(item, options);
  }
  // integrate the JSON into the parent object
  private integrateItem(item: any, options: any = {}): void {
    let vali = [];
    let req = [];
    const cols = this.schemaHelper.allCol;

    for (let y = 0; y < cols.length; y++) {
      let prop = cols[y];
      let val = item[prop];

      const reqVal = this.schemaHelper.require[prop]; // require value

      // if property is required
      if (options.requireChk && reqVal) {
        req.push(Rx.Observable.create(observer => {
          if(val) {
            observer.next();
            observer.complete();
          }
          else {
            let err = {};
            err[prop] = {
              message: typeof reqVal === 'boolean' ? `'${prop}' is a required field` : reqVal,
              kind: 'user defined',
              path: prop,
              value: val,
              name: 'ValidationError'
            };
            observer.error(new ValidationError(err, `${this.schemaHelper.tableName} validation failed`));
          }
        }));
      }

      // if a validate function exists
      if (options.validateChk && this['validate_' + prop] && typeof this['validate_' + prop] === 'function') {

        vali.push(Rx.Observable.create(observer => {
          return this['validate_' + prop](this[prop], err => {
            if (err) {              
              let error = {};
              error[prop] = {
                message: err ? err : `${prop} could not be validated`,
                kind: 'user defined',
                path: prop,
                value: val,
                name: 'ValidationError'
              };
              return observer.error(new ValidationError(error, `${this.schemaHelper.tableName} validation failed`))
            }
            observer.next();
            observer.complete();
          });
        }));

      }

      this[prop] = val;
      if (val) this.attributes[prop] = val;

      if (typeof val !== 'function')
        Object.defineProperty(this, prop, {
          get: function() {
            return val;
          },
          set: function(value) {
            val = value;
            this.attributes[prop] = value;
            this.modified[prop] = true;
          }
        });
    }
    // check if any require properties
    if (req.length > 0) this['requireObs'] = req.length > 1 ? Rx.Observable.merge.apply(this, req) : req[0];
    // check if any validation functions
    if (vali.length > 0) this['validationObs'] = vali.length > 1 ? Rx.Observable.merge.apply(this, vali) : vali[0];
  }

  isEmpty(): boolean {
    for (let key in this.attributes) {
      if (this.attributes.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  merge(object: Object): Entity {
    for (let x in object) { // iterate through all keys in object
      this[x] = object[x]; // set object key value to Entity key value
    }
    return this; // return this Entity
  }

  // UPDATEs the DB with the current object column values
  save(postCb?: string): Rx.Observable<any> {
    // observable that executes the UPDATE query with SET array + WHERE array as params
    return Rx.Observable.create(observer => {
      // two arrays for SET and WHERE
      let isInsert: boolean = false;
      let arr1 = [],
          arr2 = [];
      const keyList = this.schemaHelper.keyList;
      const columnList = this.schemaHelper.columnList;

      let q1: string = `UPDATE ${this.schemaHelper.tableName} SET `,
          q2: string = ` WHERE `;

      for(let x = 0; x < columnList.length; x++) {
        const val = columnList[x];
        if (this[val]) {
          q1 += `${val} = ?, `;
          arr1.push(this[val]);
        }
      }
      for(let y = 0; y < keyList.length; y++) {
        const val = keyList[y];
        const thisVal = this[val];
        if (thisVal) {
          q2 += `${val} = ? AND `;
          arr2.push(thisVal);
        }
      }

      const query = q1.substring(0, q1.length-2) + q2.substring(0, q2.length-4);
      const params = arr1.concat(arr2);

      if (postCb !== 'create' && postCb !== 'remove') {
         postCb = 'update';
      }

      client.execute(query, params, {prepare:true}).then(entity => {

        if(this['post_' + postCb]) { // if save Event hook set
          this['post_' + postCb](x => { // execute save hook callback
            observer.next(x);
            observer.complete();
          }, err => observer.error(err), this);
        } else { // if save hook not set
          observer.next(this); // pass this Entity into next() argument
          observer.complete();
        }
      }).catch(err => observer.error(err));

      return function(){};
    });
  }

  // REMOVEs row from the DB
  remove(postCb?: string): Rx.Observable<any> {
    // create observable that executes the DELETE query with WHERE array as params
    return Rx.Observable.create(observer => {
      // One array for WHERE
      let arr = [];

      let query: string = `DELETE FROM ${this.schemaHelper.tableName} WHERE `;
      const keyList = this.schemaHelper.keyList;

      for(let x = 0; x < keyList.length; x++) {
        const val = keyList[x];
        if (this[val]) {
          query += `${val} = ? AND `;
          arr.push(this[val]);
        }
      }

      if (postCb !== 'create' && postCb !== 'update') {
         postCb = 'remove';
      }

      client.execute(query.substring(0, query.length-4), arr, {prepare:true}).then(entity => {
        if(this['post_' + postCb]) { // if remove Event hook set
          this['post_' + postCb](x => { // executes remvoe hook callback
            observer.next(x);
            observer.complete();
          }, err => observer.error(err), this);
        } else { // if remove hook not set
          observer.next(this); // pass this Entity into next() argument
          observer.complete();
        }
      }).catch(err => observer.error(err));

      return function(){};
    });
  }
}
