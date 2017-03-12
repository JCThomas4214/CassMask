import * as cass from 'cassandra-driver';
import * as Rx from 'rxjs';
import * as _ from 'lodash';
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

export let client;

export declare type BLOB = string;
export declare type ASCII = string;
export declare type TEXT = string;
export declare type VARCHAR = string;
export declare type BOOLEAN = boolean;
export declare type DOUBLE = number;
export declare type FLOAT = number;
export declare type BIGINT = number;
export declare type INT = number;
export declare type SMALLINT = number;
export declare type TINYINT = number;
export declare type VARINT = number;
export declare type UUID = string;
export declare type TIMEUUID = string;
export declare type DATE = string;
export declare type TIME = string;
export declare type TIMESTAMP = string;
export declare type INET = string;
export declare type COUNTER = number;

// const values holding schema data types
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

export function model<T>(modelName: string, schema: Schema, options?: any): Model {
  return new Model(modelName + 's', schema, options);
}

export class Model {
    public obs: List<Rx.Observable<any>>;
    public schema: Schema;
    public schemaHelper: SchemaHelper;

    public options: any;

    constructor(modelName: string | Model, schema: Schema | List<Rx.Observable<any>>, options?: any) {
      if (modelName instanceof Model) {

        this.obs = schema as List<Rx.Observable<any>>;
        this.schema = modelName.schema;
        this.schemaHelper = modelName.schemaHelper;
        this.options = modelName.options;

      } else {
        this.obs = List<Rx.Observable<any>>([]);
        this.schema = schema as Schema;
        this.schemaHelper = new SchemaHelper(modelName, this.schema);

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

  }

  export {Entity, Schema};
