import * as cass from 'cassandra-driver';
import * as Rx from 'rxjs';

import {
  Schema, SchemaHelper,
  Entity,
  checkTable,
  executeQueryInsert,
  executeQueryDelete,
  executeQueryUpdate,
  executeQuerySelect
} from './libs';

export interface MapAction {
  action: string,
  index?: any,
  payload?: any
}

export interface ListAction {
  action: string,
  index?: any,
  payload?: any
}

export interface SetAction {
  action: string,
  index?: any,
  payload?: any 
}

export let client;

export declare type MAP = Object;
export declare type LIST = Array<any>;
export declare type SET = Object;

export declare type BLOB = string;
export declare type ASCII = string;
export declare type TEXT = string;
export declare type VARCHAR = string;
export declare type BOOLEAN = string;
export declare type DOUBLE = string;
export declare type FLOAT = string;
export declare type BIGINT = string;
export declare type INT = string;
export declare type SMALLINT = string;
export declare type TINYINT = string;
export declare type VARINT = string;
export declare type UUID = string;
export declare type TIMEUUID = string;
export declare type DATE = string;
export declare type TIME = string;
export declare type TIMESTAMP = string;
export declare type INET = string;
export declare type COUNTER = string;

// const values holding schema data types
export function MAP(keyType: string, valType: string): string {
  return MAP.schemaString(keyType, valType);
}

export namespace MAP {
  export function schemaString(keyType: string, valType: string): string {
    return `map<${keyType},${valType}>`;
  }
  export function append(keyVal: Object): MapAction {
    return {
      action: 'append',
      payload: `+ ${keyVal}`
    }
  }
  export function set(set: any, val: any): MapAction {
    return {
      action: 'set',
      index: `[${set}]`,
      payload: val
    }
  }
  export function reset(keyVal: Object): MapAction {
    return {
      action: 'reset',
      payload: keyVal
    }
  }
  export function remove(keys: Array<string>): MapAction {
    return {
      action: 'remove',
      payload: `- { ${keys.join(', ')} }`
    }
  }
}

export function LIST(valType: string): string {
  return LIST.schemaString(valType);
}

export namespace LIST {
  export function schemaString(valType: string): string {
    return `list<${valType}>`;
  }
  export function append(keyVal: Object): ListAction {
    return {
      action: 'append',
      payload: `+ ${keyVal}`
    }
  }
  export function prepend(keyVal: Object): ListAction {
    return {
      action: 'prepend',
      payload: `${keyVal} +`
    }
  }
  export function set(set: any, val: any): ListAction {
    return {
      action: 'set',
      index: `[${set}]`,
      payload: val
    }
  }
  export function reset(keyVal: Object): ListAction {
    return {
      action: 'reset',
      payload: keyVal
    }
  }
  export function remove(keys: number | string): ListAction {
    return {
      action: 'remove',
      index: `[${keys}]`
    }
  }
}

export function SET(valType: string): string {
  return SET.schemaString(valType);
}

export namespace SET {
  export function schemaString(valType: string): string {
    return `set<${valType}>`;
  }
  export function append(keyVal: Object): SetAction {
    return {
      action: 'append',
      payload: `+ ${keyVal}`
    }
  }
  export function prepend(keyVal: Object): SetAction {
    return {
      action: 'prepend',
      payload: `${keyVal} +`
    }
  }
  export function set(set: any, val: any): SetAction {
    return {
      action: 'set',
      index: `[${set}]`,
      payload: val
    }
  }
  export function reset(keyVal: Object): SetAction {
    return {
      action: 'reset',
      payload: keyVal
    }
  }
  export function remove(keys: number | string): SetAction {
    return {
      action: 'remove',
      index: `[${keys}]`
    }
  }
}

export const BLOB: string = 'blob';
export const ASCII: string = 'ascii';
export const TEXT: string = 'text';
export const VARCHAR: string = 'varchar';
export const BOOLEAN: string = 'boolean';
export const DOUBLE: string = 'double';
export const FLOAT: string = 'float';
export const BIGINT: string = 'bigint';
export const INT: string = 'int';
export const SMALLINT: string = 'smallint';
export const TINYINT: string = 'tinyint';
export const VARINT: string = 'varint';
export const UUID: string = 'uuid';
export const TIMEUUID: string = 'timeuuid';
export const DATE: string = 'date';
export const TIME: string = 'time';
export const TIMESTAMP: string = 'timestamp';
export const INET: string = 'inet';
export const COUNTER: string = 'counter';

export interface ISchema {
  id: string;
}

export interface UpdateObject {
  set: Object,
  where: Object
}

export interface SchemaOptions {
  using?: string,
  if?: string
}

interface Exclude {
  exclude: Array<string>;
}

export interface FindOptions {
  attributes?: Array<string> | Exclude,
  groupBy?: string,
  orderBy?: string,
  perPartitionLimit?: number,
  limit?: number,
  allowFiltering?: boolean
}

// replica functions for database query functions
export function now() {
  return 'now()';
}
export function uuid() {
  return 'uuid()';
}
export function toTimeStamp(timeuuid: string) {
  return `toTimeStamp(${timeuuid})`;
}

export function connect(config: any, cb?: Function): void {
  client = new cass.Client(config);

  client.connect(function(err, result) {
    if (err) {
      console.error('Could not connect to CassandraDB!');
      console.log(err);
    }
    return cb ? cb(err, result) : null;
  });
}

export function model<T>(modelName: string, schema: Schema, indexes?: Array<Array<string> | string>): Model {
  let helper = new SchemaHelper(modelName + 's', schema);

  if(indexes) {    
    for(let i = 0; i < indexes.length; i++) 
      helper.createIndex(indexes[i]);
  }

  return new Model(modelName + 's', schema, helper);
}

export class Model {
    public obs: Rx.Observable<any>;
    public schema: Schema;
    public schemaHelper: SchemaHelper;

    public options: any;

    constructor(modelName: string | Model, schema: Schema | Rx.Observable<any>, helper?: SchemaHelper, options?: any) {
      if (modelName instanceof Model) {

        this.obs = schema as Rx.Observable<any>;
        this.schema = modelName.schema;
        this.schemaHelper = modelName.schemaHelper;
        this.options = modelName.options;

      } else {
        this.obs = Rx.Observable.empty();
        this.schema = schema as Schema;
        this.schemaHelper = helper;

        if (options) this.options = options;

      }
    }

    /*
        USES THE PARED OBJECT FROM FIND() OR FINDONE() 
        AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
        EXECUTE FUNCTION

        REMOVE() IS FOR DELETING FOUND ROWS OR TRUNCATING TABLE
     */

    remove(items?: any, options?: SchemaOptions): Model { 
      let obs: Rx.Observable<any> = Rx.Observable.concat(this.obs);

      if (items) { // if items passed into function
        if (!Array.isArray(items)) items = [items];

        let preArr = []; // array to hold the preHook Observables
        let parseArr = []; // array to hold Query Observables
        // iterate through all items in the items array
        for (let x = 0; x < items.length; x++) {
          let item = new Entity(items[x], this);

          if (item['pre_remove']) {
            preArr.push(Rx.Observable.create(observer => {
              item['pre_remove'](() => {
                observer.next();
                observer.complete();
              }, err => observer.error(err), item);
            }));
          }

          parseArr.push(executeQueryDelete(item, options));
        }

        if (this.schema['pre_remove']) {
          let pre = preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0];
          obs = obs.concat(pre);
        }

        obs = obs.concat(...parseArr);

      } else { // if no items sent to the remove function

        obs = obs.concat(Rx.Observable.create(observer => {
          client.execute(`TRUNCATE ${this.schemaHelper.tableName}`).then(entity => { // entity will be useless information about DB
            observer.next(); // no argument set for next()
            observer.complete();
          }).catch(err => observer.error(err));

          return function() {};
        }));

      }

      return new Model(this, obs);
    }

    /*
        USES THE PARSED OBJECT FROM FIND() OR FINDONE()
        AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
        EXECUTE FUNCTION

        UPDATE() IS USED FOR UPDATING EXISTING ROW(S)
        IN THE TABLE
     */

    update(items: UpdateObject | Array<UpdateObject>, options?: SchemaOptions): Model {
      let obs: Rx.Observable<any> = Rx.Observable.concat(this.obs); // create new state object
      items = Array.isArray(items) ? items : [items]; // if items is not an array, make it one

      let validationArr = [];
      let preArr = []; // array to hold the preHook Observables
      let parseArr = []; // array to hold Query Observables
      // iterate through all items in the items array
      for (let x = 0; x < items.length; x++) {
        const object = items[x];
        let item = new Entity(object.set, this, {validateChk: true});
        item.merge(object.where);

        if (item['validationObs'])
          validationArr.push(item['validationObs']);

        if (item['pre_update']) {
          preArr.push(Rx.Observable.create(observer => {
            item['pre_update'](() => {
              observer.next();
              observer.complete();
            }, err => observer.error(err), item);
          }));
        }

        parseArr.push(executeQueryUpdate(item, options || {}));
      }

      if(validationArr.length > 0)
        obs = obs.concat(validationArr.length > 1 ? Rx.Observable.merge.apply(this, validationArr) : validationArr[0]);
      if (this.schema['pre_update'])
        obs = obs.concat(preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0]);

      return new Model(this, obs.concat(...parseArr));
    }

    /*
          CREATE A NEW ROW IN THE INSTANCE TABLE
            USES CASS DRIVER BATCH FUNCTION TO INSERT PARSED OBJECT ARRAY
     */

    create(items: any, options?: Object): Model {
      let obs: Rx.Observable<any> = this.obs ? Rx.Observable.concat(this.obs) : null;
      items = Array.isArray(items) ? items : [items];

      let validationArr = [];
      let requireArr = [];
      let preArr = [];
      let parseArr = [];

      // create a read only pointer to a new object from the defaults Map
      const defaults = this.schemaHelper.defaults;
      // merge default values with each item in the items array
      for(let x = 0; x < items.length; x++) {
        let item = items[x];
        item = new Entity(item, this, {validateChk: true, requireChk: true, useDefaults: true});

        if(item['requireObs'])
          requireArr.push(item['requireObs']);

        if(item['validationObs'])
          validationArr.push(item['validationObs']);

        if(item['pre_create']) {
          preArr.push(Rx.Observable.create(observer => {
            item['pre_create'](() => {
              observer.next();
              observer.complete();
            }, err => observer.error(err), item);
          }));
        }

        parseArr.push(executeQueryInsert(item, options));
      }

      if(requireArr.length > 0)
        obs = obs.concat(requireArr.length > 1 ? Rx.Observable.merge.apply(this, requireArr) : requireArr[0])
      if(validationArr.length > 0)
        obs = obs.concat(validationArr.length > 1 ? Rx.Observable.merge.apply(this, validationArr) : validationArr[0]);
      if (this.schema['pre_create'])
        obs = obs.concat(preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0]);

      return new Model(this, obs.concat(...parseArr));
    }

    /*
          PARSES ATTR INTO FINDS OBJECT TO THEN QUERY THE DB
     */

    find(object?: Object, options?: FindOptions): Model {
      let obs: Rx.Observable<any> = Rx.Observable.concat(this.obs);
      let item: Entity = new Entity(object || {}, this);

      if (item['pre_find']) {
        obs = obs.concat(Rx.Observable.create(observer => {
          item['pre_find'](() => {
            observer.next();
            observer.complete();
          }, err => observer.error(err), item);
        }));
      }
      
      obs = obs.concat(executeQuerySelect(item, options));

      return new Model(this, obs);
    }

    findOne(object?: Object, options?: FindOptions): Model {
      if (!options) options = {};
      options.limit = 1;

      return this.find(object, options);
    }

    findById(id: string, options?: FindOptions): Model {
      return this.find({ id: id }, options);
    }
    
    seam(): Rx.Observable<any> {      
      return checkTable(this.obs, this.schemaHelper).filter(x => x); // filter out any undefined arguments from observer.next()
    }

    post(hook: string | Array<string>, fn: Function): void {
      return this.schema.post(hook, fn);
    }

    pre(hook: string | Array<string>, fn: Function): void {
      return this.schema.pre(hook, fn);
    }

    methods(scope: Object): void {
      return this.schema.methods(scope);
    }

    validate(path: string, fn: Function): void {
      return this.schema.validate(path, fn);
    }

    createIndex(property: string | Array<string>): void {
      this.schemaHelper.createIndex(property);
    }

  }

  export {Entity, Schema};
