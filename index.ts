const cass = require('cassandra-driver');
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { List, Map } from 'immutable';

import {
  Helper,
  Entity,
  parseModel,
  createTable, checkTable,
  create, parseQueryInsert,
  remove, parseQueryDelete,
  update, parseQueryUpdate,
  find, findOne, findById, parseQuerySelect,
  seam,
  post, pre
} from './libs';

export let client;

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

export class Model {
    public state: Map<any, any>;

    public obs: List<Rx.Observable<any>>;
    public tableName: string;
    public tblChked: boolean = false;
    public schema: any;
    public helper: any;

    public options: any;

    constructor(modelName: string | Model, schema?: any, options?: any) {
      if (modelName instanceof Model) {

        this.obs = schema;
        this.tableName = modelName.tableName;
        this.tblChked = modelName.tblChked;
        this.schema = modelName.schema;
        this.helper = modelName.helper;
        this.options = modelName.options;

      } else {

        this.obs = List<Rx.Observable<any>>([]);
        this.tableName = modelName;
        this.schema = parseModel(schema);
        this.helper = new Helper();

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

    public post = post;
    public pre = pre;

    methods(scope: Object): void {
      for (let x in scope) this.helper.methods[x] = scope[x];
    }

  }

  export {Entity};
