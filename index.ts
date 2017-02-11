let cass = require('cassandra-driver');
import * as Rx from 'rxjs';
import { List } from 'immutable';

import { 
  seam, find, findOne, create, parseQueryInsert,
  update, parseQueryUpdate, remove, parseQueryDelete,
  checkTable, createTable, createBatchQuery, parseModel
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
  static TEXT: string = 'text';  
  static INT: string = 'int';
  static UUID: string = 'uuid';
  static TIMEUUID: string = 'timeuuid';
  static TIMESTAMP: string = 'timestamp';
  
  // Connect function is used to connect to Cassandra
  // and store the client object 
  static connect(config: any, cb?) {
    cassandra.client = new cass.Client(config);

    cassandra.client.connect(function(err, result) {
      if (err) {
        console.error('Could not connect to CassandraDB!');
        console.log(err);
      }
      // let test = cassandra.client.HostMap();

      // console.log(cassandra.client);
      // console.log(cassandra.client.host);

      return cb ? cb(err, result) : null;
    });
  }
}

export class Schema {
    private tblChked: boolean = false;

    private obs: List<Rx.Observable<any>> = List<Rx.Observable<any>>([]);
    private batchable: List<any> = List<any>([]);

    private model: any;
    private tableName: string;

    public createHook: boolean = false;
    public removeHook: boolean = false;
    public updateHook: boolean = false;
    public findHook: boolean = false;

    public createCb: Function;
    public removeCb: Function;
    public updateCb: Function;
    public findCb: Function;

    // Default Options
    private options: any = {

    };

    constructor(modelName: string, model: any, options?: any) {
      this.model = this.parseModel(model);
      this.tableName = modelName;
      this.options = this.options || options;
    }

    private parseModel = parseModel;

    private parseQueryInsert = parseQueryInsert;
    private parseQueryUpdate = parseQueryUpdate;
    private parseQueryDelete = parseQueryDelete;
    private createBatchQuery = createBatchQuery;

    private createTable = createTable;
    private checkTable = checkTable;

    public remove = remove;
    public update = update;
    public create = create;
    public find = find;
    public findOne = findOne;
    public seam = seam;

    public schema = new Events(this);

  }

 class Events {
   private parent: Schema;

   constructor(parent: Schema) {
     this.parent = parent;
   }

   post(method: string, fn: Function): void {
     switch (method) {
       case "save":
         this.parent.createHook = true;
         this.parent.createCb = fn;
         break;
       case "update":
         this.parent.updateHook = true;
         this.parent.updateCb = fn;
         break;
       case "find":
         this.parent.findHook = true;
         this.parent.findCb = fn;
         break;
       case "remove":
         this.parent.removeHook = true;
         this.parent.removeCb = fn;
         break;
     }
     return;
   }
 };