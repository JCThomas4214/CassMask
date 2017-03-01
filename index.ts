const cass = require('cassandra-driver');
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { List, Map } from 'immutable';

import {
  Helper,
  Entity, newEntity,
  parseModel,
  createTable, checkTable,
  create, parseQueryInsert,
  remove, parseQueryDelete,
  update, parseQueryUpdate,
  find, findOne, findById, parseQuerySelect,
  seam,
  post, pre
} from './libs';


export function now() {
  return 'now()';
}
export function uuid() {
  return 'uuid()';
}
export function toTimeStamp(timeuuid: string) {
  return `toTimeStamp(${timeuuid})`;
}

export class cassandra {
  // client object
  static client: any;

  // Cassandra data types
  static BLOB: string = 'blob';

  static ASCII: string = 'ascii';
  static TEXT: string = 'text'; 
  static VARCHAR: string = 'varchar';

  static BOOLEAN: string = 'boolean';

  static DOUBLE: string = 'double';
  static FLOAT: string = 'float';
  static BIGINT: string = 'bigint';
  static INT: string = 'int';
  static SMALLINT: string = 'smallint';
  static TINYINT: string = 'tinyint';
  static VARINT: string = 'varint';

  static UUID: string = 'uuid';
  static TIMEUUID: string = 'timeuuid';

  static DATE: string = 'date';
  static TIME: string = 'time';
  static TIMESTAMP: string = 'timestamp';

  static INET: string = 'inet';

  static COUNTER: string = 'counter';

  
  // Connect function is used to connect to Cassandra
  // and store the client object 
  static connect(config: any, cb?) {
    cassandra.client = new cass.Client(config);

    cassandra.client.connect(function(err, result) {
      if (err) {
        console.error('Could not connect to CassandraDB!');
        console.log(err);
      }
      return cb ? cb(err, result) : null;
    });
  }
}

export class Schema {
    public state: Map<any, any>;

    public obs: List<Rx.Observable<any>>;
    public tableName: string;
    public tblChked: boolean = false;
    public model: any;
    public helper: any;

    public options: any;

    constructor(modelName: string | Schema, model?: any, options?: any) {
      if (modelName instanceof Schema) {

        this.obs = model;
        this.tableName = modelName.tableName;
        this.tblChked = modelName.tblChked;
        this.model = modelName.model;
        this.helper = modelName.helper;
        this.options = modelName.options;

      } else {

        this.obs = List<Rx.Observable<any>>([]);
        this.tableName = modelName;
        this.model = parseModel(model);
        this.helper = new Helper();

        if (options) this.options = options; 

      }
    }

    public newEntity = newEntity;

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

  }

  export {Entity};
