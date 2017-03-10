import { client, Model } from '../index';
import { Schema } from './schema';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

/*
     Entity class is the object that will be instantiated with the DB response row data
       Entity holds it's cooresponding schema's current state and the item properties that is passed into it
       Entity has two basic functions, save() and remove() to UPDATE or DELETE the row it's properties relates to 
 */
export class Entity extends Schema {
  public toJSON: Function;
  private modified: Object = {};
  public attributes: Object = {};

  constructor(item: any, parent: Model) {
    // super will be the Schema class with all defined event functions
    super(parent.schema);
    // remove all exploitable properties from the item
    // when passed back through express response
    this.toJSON = function() {
      delete this.tableName;
      delete this.tblChked;
      delete this.columns;
      delete this.keys;
      delete this.allCol;
      delete this.columnList;
      delete this.keyList;
      delete this.defaults;

      delete this.modified;
      delete this.attributes;
      return this;
    };

    // create class properties cooresponding to column values
    this.integrateItem(item);
  }
  // integrate the JSON into the parent object
  private integrateItem(item: any): void {
    const cols = this.allCol;

    for (let y = 0; y < cols.length; y++) {
      let prop = cols[y];
      let val = item[prop];

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
      const keyList = this.keyList;
      const columnList = this.columnList;

      let q1: string = `UPDATE ${this.tableName} SET `,
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

        if(this['post' + postCb]) { // if save Event hook set
          this['post' + postCb](x => { // execute save hook callback
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

      let query: string = `DELETE FROM ${this.tableName} WHERE `;
      const keyList = this.keyList;

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
        if(this['post' + postCb]) { // if remove Event hook set
          this['post' + postCb](x => { // executes remvoe hook callback
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