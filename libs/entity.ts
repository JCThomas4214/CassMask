'use strict';

import { cassandra, Schema } from '../index';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';



export function newEntity(item: Object): Entity {
  const defaults = this.model.defaults;

  for (let x in defaults) {
    if (!item[x]) item[x] = defaults[x];
  }

  return new Entity(item, this);
}

/*
     Entity class is the object that will be instantiated with the DB response row data
       Entity holds it's cooresponding schema's current state and the item properties that is passed into it
       Entity has two basic functions, save() and remove() to UPDATE or DELETE the row it's properties relates to 
 */
export class Entity {
  public toJSON: Function;
  private model: any;
  private tableName: string;
  private modified: Object = {};
  public attributes: Object = {};

  public preCreateCb: Function;
  public preUpdateCb: Function;
  public preRemoveCb: Function;
  public preFindCb: Function;
  public postCreateCb: Function;
  public postUpdateCb: Function;
  public postRemoveCb: Function;
  public postFindCb: Function;

  constructor(item: any, parent: Schema) {
    // remove all exploitable properties from the item
    // when passed back through express response
    this.toJSON = function() {
      let obj = this;
      delete obj.model;
      delete obj.tableName;
      delete obj.modified;
      delete obj.attributes;
      return obj;
    };

    this.model = parent.model;
    this.tableName = parent.tableName;

    // create functions for parent based off of the Schema state
    this.integrateMethods(parent.helper);  
    // create class properties cooresponding to column values
    this.integrateItem(item);
  }
  // integrate the JSON into the parent object
  private integrateItem(item: any): void {
    const cols = this.model.allCol;

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
  // integrate methods into parent object
  private integrateMethods(methods: any) {
    for (let x in methods) {
      if (x !== 'methods')
        this[x] = methods[x];
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
      const keyList = this.model.keyList;
      const columnList = this.model.columnList;

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

      switch (postCb) {
        case 'create':
          postCb = 'postCreateCb';
          break;
        case 'remove':
          postCb = 'postRemoveCb';
          break;
        default:
          postCb = 'postUpdateCb';
          break;
      }
      
      cassandra.client.execute(query, params, {prepare:true}).then(entity => {

        if(this[postCb]) { // if save Event hook set
          this[postCb](x => { // execute save hook callback
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
      const keyList = this.model.keyList;

      for(let x = 0; x < keyList.length; x++) {
        const val = keyList[x];
        if (this[val]) {
          query += `${val} = ? AND `;
          arr.push(this[val]);
        }
      }

      switch (postCb) {
        case 'create':
          postCb = 'postCreateCb';
          break;
        case 'update':
          postCb = 'postUpdateCb';
          break;
        default:
          postCb = 'postRemoveCb';
          break;
      }

      cassandra.client.execute(query.substring(0, query.length-4), arr, {prepare:true}).then(entity => {
        if(this[postCb]) { // if remove Event hook set
          this[postCb](x => { // executes remvoe hook callback
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