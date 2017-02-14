let cass = require('cassandra-driver');
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

import { 
  seam, find, findOne, create, parseQueryInsert,
  update, parseQueryUpdate, remove, parseQueryDelete,
  checkTable, createTable, createBatchQuery, parseModel
} from './libs';

export interface IState {
  obs: List<Rx.Observable<any>>;
  batchable: List<any>;

  options: Map<any,any>;
  model: Map<any,any>;
}

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
    // private obs: List<Rx.Observable<any>> = List<Rx.Observable<any>>([]);
    // private batchable: List<any> = List<any>([]);

    public state: Map<IState, IState> = Map<IState, IState>({
      obs: List<Rx.Observable<any>>([]),
      batchable: List<any>([])
    });

    constructor(modelName: string, model: any, options?: any) {
      if (options) this.state = this.state.setIn(['options'], Map<any,any>(options));

      this.state = this.state
        .setIn(['model'], Map<any,any>(this.parseModel(model)))
        .setIn(['tableName'], modelName);
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
         this.parent.state = this.parent.state
           .setIn(['createHook'], true)
           .setIn(['createCb'], fn);
         break;
       case "update":
         this.parent.state = this.parent.state
           .setIn(['updateHook'], true)
           .setIn(['updateCb'], fn);
         break;
       case "find":
         this.parent.state = this.parent.state
           .setIn(['findHook'], true)
           .setIn(['findCb'], fn);
         break;
       case "remove":
         this.parent.state = this.parent.state
           .setIn(['removeHook'], true)
           .setIn(['removeCb'], fn);
         break;
     }
     return;
   }
 };