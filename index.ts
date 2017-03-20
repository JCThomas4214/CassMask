import * as cass from 'cassandra-driver';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

import {
  Schema, SchemaHelper,
  Entity,
  createTable, checkTable,
  create, parseQueryInsert,
  remove, parseQueryDelete,
  update, parseQueryUpdate,
  find, findOne, findById, parseQuerySelect,
  seam
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
    public obs: List<Rx.Observable<any>>;
    public schema: Schema;
    public schemaHelper: SchemaHelper;

    public options: any;

    constructor(modelName: string | Model, schema: Schema | List<Rx.Observable<any>>, helper?: SchemaHelper, options?: any) {
      if (modelName instanceof Model) {

        this.obs = schema as List<Rx.Observable<any>>;
        this.schema = modelName.schema;
        this.schemaHelper = modelName.schemaHelper;
        this.options = modelName.options;

      } else {
        this.obs = List<Rx.Observable<any>>([]);
        this.schema = schema as Schema;
        this.schemaHelper = helper;

        if (options) this.options = options;

      }
    }

    private createTable = createTable;
    private checkTable = checkTable;
    private parseQueryInsert = parseQueryInsert;
    private parseQueryDelete = parseQueryDelete;
    private parseQueryUpdate = parseQueryUpdate;
    private parseQuerySelect = parseQuerySelect;

    public remove = remove;
    public update = update;
    public create = create;
    public find = find;
    public findOne = findOne;
    public findById = findById;
    public seam = seam;

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
