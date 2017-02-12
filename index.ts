let cass = require('cassandra-driver');
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

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
      return cb ? cb(err, result) : null;
    });
  }
}

export class Schema {
    public state: Map<any, any>;

    constructor(modelName: string, model: any, options?: any) {

      this.state = Map<any,any>({
        obs: List<Rx.Observable<any>>([]),
        batchable: List<any>([]),
        events: Map<any,any>([])
      })
      .set('model', Map<any,any>(this.parseModel(model)))
      .set('tableName', modelName);

      if (options) this.state = this.state.set('options', Map<any,any>(options));   

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

 /*
      Events class is a class that contains the post() function which changes the Schema state to reflect any set event hooks
  */
 class Events {
   private parent: Schema;

   constructor(parent: Schema) {
     this.parent = parent;
   }
   // post() is the event hook setting function
   // pass in the hook event; 'save', 'remove', 'find'
   // pass in a callback function that will be executed upon event
   post(method: string, fn: Function): void {
     switch (method) {
       case "save":
         this.parent.state = this.parent.state
           .setIn(['events', 'saveHook'], true)
           .setIn(['events', 'saveCb'], fn);
         break;
       case "find":
         this.parent.state = this.parent.state
           .setIn(['events', 'findHook'], true)
           .setIn(['events', 'findCb'], fn);
         break;
       case "remove":
         this.parent.state = this.parent.state
           .setIn(['events', 'removeHook'], true)
           .setIn(['events', 'removeCb'], fn);
         break;
     }
     return;
   }
 };

 /*
      Entity class is the object that will be instantiated with the DB response row data
        Entity holds it's cooresponding schema's current state and the item properties that is passed into it
        Entity has two basic functions, save() and remove() to UPDATE or DELETE the row it's properties relates to 
  */
 export class Entity {
   public toJSON: Function;
   private state: Map<any,any>;

   constructor(item: any, state: Map<any,any>) {
     // remove all exploitable properties from the item
     // when passed back through express response
     this.toJSON = function() {
       var obj = this;
       delete obj.state;
       return obj;
     };

     this.state = state
       .delete('obs')
       .delete('batchable')
       .delete('tblChked')
       // DELETE query string
       .set('removeQ', this.removeQuery(state))
       // UPDATE query string
       .set('saveQ', this.saveQuery(state));

     // create class properties cooresponding to column values
     for (let x in item) this[x] = item[x];
   }

   // creates DELETE query string for this table
   private removeQuery(state: Map<any,any>): string {
     let query: string = `DELETE FROM ${state.get('tableName')} WHERE `;

     state.getIn(['model', 'keyList']).forEach(val => {
       query += `${val} = ? AND `;
     });
     query = query.substring(0, query.length-4);

     return query;
   }

   // creates UPDATE query strign for this table
   private saveQuery(state: Map<any,any>): string {
     let q1: string = `UPDATE ${state.get('tableName')} SET `,
         q2: string = ` WHERE `;

     state.getIn(['model', 'columnList']).forEach(val => {
       if (!state.getIn(['model', 'keyList']).includes(val)) q1 += `${val} = ?, `;
       else q2 += `${val} = ? AND `;
     });
     return q1.substring(0, q1.length-2) + q2.substring(0, q2.length-4);
   }

   // UPDATEs the DB with the current object column values
   save(): Rx.Observable<any> {
     // two arrays for SET and WHERE
     let arr1 = [],
         arr2 = [];

     // For all columns in the table if column is not a key add to SET array
     // if column is a key add value to WHERE array
     this.state.getIn(['model','columnList']).forEach(val => {
       if (!this.state.getIn(['model', 'keyList']).includes(val)) arr1.push(this[val]);
       else arr2.push(this[val]);
     });

     // return observable that executes the UPDATE query with SET array + WHERE array as params
     return Rx.Observable.create(observer => {
       const func = () => cassandra.client.execute(this.state.get('saveQ'), arr1.concat(arr2), {prepare:true});

       func().then(entity => {
         if(this.state.getIn(['events','saveHook'])) { // if save Event hook set
           this.state.getIn(['events','saveCb'])(this, x => { // execute save hook callback
             observer.next(x);
             observer.complete();
           }, cassandra.client);
         } else { // if save hook not set
           observer.next(this); // pass this Entity into next() argument
           observer.complete();
         }
       }).catch(err => observer.error(err));

       return function(){};
     });
   }

   // REMOVEs row from the DB
   remove(): Rx.Observable<any> {
     // One array for WHERE
     let arr = [];

     // WHERE clause only cares about key values
     // push key values into WHERE array
     this.state.getIn(['model','keyList']).forEach(val => {
       arr.push(this[val]);
     });

     // create observable that executes the DELETE query with WHERE array as params
     return Rx.Observable.create(observer => {
       const func = () => cassandra.client.execute(this.state.get('removeQ'), arr, {prepare:true});

       func().then(entity => {
         if(this.state.getIn(['events','removeHook'])) { // if remvoe Event hook set
           this.state.getIn(['events','removeCb'])(this, x => { // executes remvoe hook callback
             observer.next(x);
             observer.complete();
           }, cassandra.client);
         } else { // if remove hook not set
           observer.next(this); // pass this Entity into next() argument
           observer.complete();
         }
       }).catch(err => observer.error(err));

       return function(){};
     });    
   }
 }