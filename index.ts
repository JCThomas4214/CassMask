const cass = require('cassandra-driver');
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { List, Map } from 'immutable';


export function now() {
  return 'now()';
}
export function uuid() {
  return 'uuid()';
}
export function toTimeStamp(timeuuid: string) {
  return `toTimeStamp(${timeuuid})`;
}

// Returns the set difference of the first source array to the second
function objDiff(object: Array<string>, source: Array<string>) {
  let dest = [];
  for (let x = 0; x < object.length; x++) {
    const objVal = object[x];
    for (let y = 0; y < source.length; y++) {
      if (objVal === source[y]) break;
      if (y === source.length - 1) dest.push(objVal);
    }
  }
  return dest;
}

/*
    PARSES THE MODEL SENT INTO THE CONTRUCTOR
      WILL CREATE A KEY VALUE ARRAY TO USE IN 
      LATER FUNCTIONS
 */

function parseModel(model: any): any {
  const keys = model['keys'];

  let columns = [], // array for column names and data type
      colName = [], // array for column names only
      defaults = {};

  if (!model['id']) {
    model['id'] = {
      Type: 'uuid',
      Default: 'uuid()'
    };
  }
  // for every key in the model JSON
  for (let x in model) { 
    const val = model[x];

    if (x !== 'keys') { // if key is not the PRIMARY KEYS, 'keys'
      if (typeof val === 'string') {

        columns.push(`${ x } ${ val }`); // push name and datatype to columns array
        colName.push(x); // push only column name to colName array

      } else if (typeof val === 'object') {

        columns.push(`${ x } ${ val.Type }`); // push name and datatype to columns array
        colName.push(x); // push only column name to colName array
        if (val.Default) 
          defaults[x] = val.Default

      }
    }
  }
  // console.log(_.difference(colName, keys), keys);
  // console.log(objDiff(colName, keys), keys);
  // return model object that will be used for query functions
  return {
    columns: columns.join(', '),
    keys: keys.join(', '),
    columnList: List<any>(objDiff(colName, keys)),
    keyList: List<any>(keys),
    defaults: Map<any,any>(defaults)
  };
}

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

function createTable(state: Map<any,any>): Map<any,any> {
  // immutablejs object update to push to obs List
  return state.update('obs', obs => obs.push(Rx.Observable.create(observer => {
    const table = state.get('tableName');
    const q1 = `CREATE TABLE IF NOT EXISTS ${ table } (${ state.getIn(['model', 'columns']) }, PRIMARY KEY (${ state.getIn(['model', 'keys']) }))`;   

    // when subscribe() execute create table query
    cassandra.client.execute(q1).then(entity => { // observer will not pass any arguments from the query
      const q2 = `CREATE CUSTOM INDEX ${ table }_id on ${ table } (id) using 'org.apache.cassandra.index.sasi.SASIIndex'`;
      cassandra.client.execute(q2).then(entity => {
        observer.next();
        observer.complete();
      }).catch(err => {
        observer.next();
        observer.complete();
      });
    }).catch(err => observer.error(err));;

    return function () {};

  })));
}

/*
    checktable() is used to check if tble query has ever been executed on the DB will only be executed once per Schema after server start
      if false, append create table query observable to obs List and return new state
      else, return passed state
 */
function checkTable(state: Map<any,any>): Map<any,any> {
  if (!state.get('tblChked')) { // if state.tblChked === false
    const st = state.set('tblChked', true); // state.tblChked = true
    return createTable(st); // createTable() will return new state with appended obs List
  }
  return state;
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
    public helpers: any;

    constructor(modelName: string | Map<any,any>, model?: any, options?: any) {
      if (modelName instanceof Map) {
        this.state = Map<any,any>(modelName);

        const hookCb = this.state.get('events').toObject();
        for(let x in hookCb) this[x] = hookCb[x];

        const helpers = this.state.get('helpers');
        if (helpers) this.helperMethods(helpers.toObject());
      } else {
        this.state = Map<any,any>({
          obs: List<Rx.Observable<any>>([]),
          batchable: List<any>([]),
          events: Map<any,any>([])
        })
        .set('model', Map<any,any>(parseModel(model)))
        .set('tableName', modelName);

        if (options) this.state = this.state.set('options', Map<any,any>(options));   
      }
    }

    newEntity(item: Object): Entity {
      const defaults = this.state.getIn(['model', 'defaults']).toObject();

      for (let x in defaults) {
        if (!item[x]) item[x] = defaults[x];
      }

      return new Entity(item, this, true);
    }

    /*
        PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
          THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
     */
    private parseQueryInsert(item: any, options: any): Rx.Observable<any> {

      return Rx.Observable.create(observer => {
        let params = [];
        // INSERT is a more complicated query that requires more feness
        // // separate query into two parts, columns & values
        let tmp1 = `INSERT INTO ${this.state.get('tableName')} (`; // columns will be appended to this
        let tmp2 = `) VALUES (`; // values appended to this
        // for all keys in the current object
        for(let y in item) {
            const val = item[y]; // hold onto key's value for faster reads
            tmp1 += `${y}, `; // append iteration's key to columns string
            // check to make sure that value is not a DB function
            // if value is DB function
            if (val === 'now()' || val === 'uuid()' || val === 'toTimeStamp(now())') {
              tmp2 += `${val}, `; // function must be appended to values string
            } else { // if not a DB function
              tmp2 += '?, '; // appends '?' as necessary for prepared queries
              params.push(val); // push value into q's params array
            }
        }

        const query = tmp1.substring(0, tmp1.length-2) + tmp2.substring(0, tmp2.length-2) + ')'; // q's query string set to concat of columns and values string

        cassandra.client.execute(query, params, {prepare:true}).then(entity => { // entity will be useless from DB
          if(this['postSaveCb']) { // if save Event hook set
            this['postSaveCb'](new Entity(item, this), x => { // execute the save hook callback
              observer.next(x);
              observer.complete();
            }, cassandra.client);
          } else { // if no save hook set
            observer.next(new Entity(item, this)); // set next() argument to new Entity
            observer.complete();
          }
        }).catch(err => observer.error(err));

        return function(){};

      });

    }

    /*
        PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
          THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
     */

    private parseQueryDelete(item: any, options: any): Rx.Observable<any> {

      return Rx.Observable.create(observer => {
          let params = [];

          let tmp = `DELETE FROM ${this.state.get('tableName')} WHERE`; // set starting query string
          // for all keys in this item
          for(let y in item) {
            tmp += ` ${y} = ? AND`; // append key to query string
            params.push(item[y]); // push value to params array
          }
          const query = tmp.substring(0, tmp.length-4); // truncate last ' AND' on the string

          cassandra.client.execute(query, params, {prepare:true}).then(entity => { // entity will be useless information about the DB
            if(this['postRemoveCb']) { // if remvoe event hook was set
              this['postRemoveCb'](new Entity(item, this), x => { // execute remove hook callback
                observer.next(x);
                observer.complete();
              }, cassandra.client);
            } else { // if remvoe hook was not set
              observer.next(new Entity(item, this)); // set next() argument to new Entity aligned with items iteration
              observer.complete();
            }
          }).catch(err => observer.error(err));

          return function(){};
      });

    }

    /*
        PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
          THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
     */
    private parseQueryUpdate(item: any, options: any): Rx.Observable<any> {

      return Rx.Observable.create(observer => {
          let params = [];
          let ent = {}; // create hoder object to merge set and in at this index
          // start query string at this base
          let tmp = `UPDATE ${this.state.get('tableName')} SET`;
          // for all keys in the set object
          for(let y in item.set) {
            tmp += ` ${y} = ?, `; // append set attributes to query string
            params.push(item.set[y]); // push values to params array
            ent[y] = item.set[y]; // and set ent key value to match
          }
          tmp = tmp.substring(0, tmp.length-2) + ' WHERE'; // truncate the last ', ' from the query string
          // append WHERE to continue the query string with keys in 'in' object
          // for all keys in the 'in' object
          for(let z in item.in) {
            tmp += ` ${z} = ? AND`; // append all 'in' keys to query string
            params.push(item.in[z]); // push key values to params array
            ent[z] = item.in[z]; // append key values to ent to match
          }

          const query = tmp.substring(0, tmp.length-4) + ' IF EXISTS'; // set the query key in q array to new query string

          cassandra.client.execute(query, params, {prepare:true}).then(entity => { // if the event hook was set
            if(this['postSaveCb']) { // in state.events.saveHook will indicator boolean
              // execute the hook callback and create newEntity object with current entity JSON
              this['postSaveCb'](new Entity(ent, this), x => {
                observer.next(x);
                observer.complete();
              }, cassandra.client);
            } else { // if no hook was set
              observer.next(new Entity(ent, this)); // next() arg is new Entity object
              observer.complete(); // now complete
            }
          }).catch(err => observer.error(err));

          return function(){};
      });

    }

    private parseQuerySelect(item?: any, options?: any): Rx.Observable<any> {

      return Rx.Observable.create(observer => {

        let query = `SELECT * FROM ${this.state.get('tableName')} WHERE`; // start with a base query
        let params = []; // where params will be stored

        if (item) {
          // append to query string all columns and push values to params array
          for(let x in item) {
            query += ` ${x} = ? AND`;
            params.push(item[x]);
          }
          query = query.substring(0, query.length-4); // truncate last AND in the query string
        } else {
          query = `SELECT * FROM ${this.state.get('tableName')}`;
        }
        if (options && options.limitOne) query += ' LIMIT 1';
        // options for allow filtering
        if (options && options.allowFiltering && params.length > 0) query += ' ALLOW FILTERING';
       
        console.log(query);

        cassandra.client.execute(query, params, {prepare:true}).then(entity => {
          // all rows in the response will be stored in a Entity class inside items array
          const rows = entity.rows;
          let items = [];
          for (let z = 0; z < rows.length; z++) {
            items.push(new Entity(rows[z], this))
          }
          // make items a single object if only one object exists in the array
          items = items.length > 1 ? items : items[0];

          // If the find event hook was initialized
          if(this['postFindCb']) { // if find Event hook set
            this['postFindCb'](items, x => { // execute the find hook callback
              observer.next(x);
              observer.complete();
            }, cassandra.client);
          } else { // if no find hook set
            observer.next(items); // set next() argument to Entity array
            observer.complete();
          }
        }).catch(err => observer.error(err));

        return function () {};
      });

    }

    /*
        USES THE PARED OBJECT FROM FIND() OR FINDONE() 
        AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
        EXECUTE FUNCTION

        REMOVE() IS FOR DELETING FOUND ROWS OR TRUNCATING TABLE
     */

    remove(items?: any, options?: Object): Schema { 
      let state = Map<any,any>(this.state);

      if (items) { // if items passed into function

        let preArr = []; // array to hold the preHook Observables
        let parseArr = []; // array to hold Query Observables
        // iterate through all items in the items array
        for (let x = 0; x < items.length; x++) {
          const item = items[x];

          if (this['preRemoveCb']) {
            preArr.push(Rx.Observable.create(observer => {
              this['preRemoveCb'](item, () => {
                observer.next();
                observer.complete();
              }, err => observer.error(err));
            }));
          }

          parseArr.push(this.parseQueryDelete(item, options));
        }

        if (this['preRemoveCb']) {  
          state = checkTable(state).update('obs', obs => obs.push(
            preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0]));
        } 

        state = checkTable(state).update('obs', obs => obs.concat(parseArr));

      } else { // if no items sent to the remove function

        state = checkTable(state).update('obs', obs => obs.push(Rx.Observable.create(observer => {
          cassandra.client.execute(`TRUNCATE ${state.get('tableName')}`).then(entity => { // entity will be useless information about DB
            observer.next(); // no argument set for next()
            observer.complete();
          }).catch(err => observer.error(err));

          return function() {};
        })));

      }

      return new Schema(state);
    }

    /*
        USES THE PARSED OBJECT FROM FIND() OR FINDONE() 
        AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
        EXECUTE FUNCTION

        UPDATE() IS USED FOR UPDATING EXISTING ROW(S)
        IN THE TABLE
     */

    update(items: any, options: Object = {}): Schema {
      let state = Map<any,any>(this.state); // create new state object 
      items = Array.isArray(items) ? items : [items]; // if items is not an array, make it one

      let preArr = []; // array to hold the preHook Observables
      let parseArr = []; // array to hold Query Observables
      // iterate through all items in the items array
      for (let x = 0; x < items.length; x++) {
        const item = items[x];

        if (this['preSaveCb']) {
          preArr.push(Rx.Observable.create(observer => {
            this['preSaveCb'](item, () => {
              observer.next();
              observer.complete();
            }, err => observer.error(err));
          }));
        }

        parseArr.push(this.parseQueryUpdate(item, options));
      }

      if (this['preSaveCb']) {  
        state = checkTable(state).update('obs', obs => obs.push(
          preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0]));
      } 

      state = checkTable(state).update('obs', obs => obs.concat(parseArr));

      return new Schema(state);
    }

    /*
          CREATE A NEW ROW IN THE INSTANCE TABLE
            USES CASS DRIVER BATCH FUNCTION TO INSERT PARSED OBJECT ARRAY
     */

    create(items: any, options?: Object): Schema { 
      let state = Map<any,any>(this.state);
      items = Array.isArray(items) ? items : [items];

      let preArr = [];
      let parseArr = [];

      // create a read only pointer to a new object from the defaults Map
      const defaults = this.state.getIn(['model', 'defaults']).toObject();
      // merge default values with each item in the items array
      for(let x = 0; x < items.length; x++) {
        const item = items[x];
        // Any value that has a default but is not indicated in the item will be default
        // _.mergeWith(items[x], defaults, objVal => objVal);
        for(let y in defaults) { // go through all items in object
          if (!item[y]) item[y] = defaults[y]; // if a default property does not exist, make it
        }
        // if 
        if (this['preSaveCb']) {
          preArr.push(Rx.Observable.create(observer => {
            this['preSaveCb'](item, () => {
              observer.next();
              observer.complete();
            }, err => observer.error(err));
          }));
        }

        parseArr.push(this.parseQueryInsert(item, options));
      }

      if (this['preSaveCb']) {  
        state = checkTable(state).update('obs', obs => obs.push(
          preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0]));
      } 

      state = checkTable(state).update('obs', obs => obs.concat(parseArr));

      return new Schema(state);
    }
    
    /*
          PARSES ATTR INTO FINDS OBJECT TO THEN QUERY THE DB
     */

    find(object?: Object, options?: any): Schema {
      let state = Map<any,any>(this.state);

      if (this['preFindCb']) {
        state = state.update('obs', obs => obs.push(Rx.Observable.create(observer => {
          this['preFindCb'](object, () => {
            observer.next();
            observer.complete();
          }, err => observer.error(err));
        })));
      }
      
      state = state.update('obs', obs => obs.push(this.parseQuerySelect(object, options)));

      return new Schema(state);
    }
   
    /*
          CHANGES THE FIND1 VARIABLE TO TRUE
            THIS WILL CAUSE EXEC TO LIMIT THE QUERY TO 1
     */

    findOne(object?: Object, options?: any): Schema {
      let state = Map<any,any>(this.state);

      if (!options) options = {};
      options.limitOne = true; // Make sure we limit the response to one row

      if (this['preFindCb']) {
        state = state.update('obs', obs => obs.push(Rx.Observable.create(observer => {
          this['preFindCb'](object, () => {
            observer.next();
            observer.complete();
          }, err => observer.error(err));
        })));
      }
      
      state = state.update('obs', obs => obs.push(this.parseQuerySelect(object, options)));

      return new Schema(state);
    }

    /*
         USES THE PARSED OBJECT FROM FIND() OR FINDONE() 
         AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
         EXECUTE FUNCTION

         SEAM() IS USED FOR FINDS ONLY
     */

    seam(): Rx.Observable<any> {
      // If the observable array is larger than one we will concat the observables into one
      // else we will return the only observable in the array
        // in either case we will filter out the undefined args

      const seamed = this.state.get('obs').size > 1 ? 
        Rx.Observable.concat.apply(this, this.state.get('obs').toArray()) : 
        this.state.get('obs').first();

      return seamed.filter(x => x); // filter out any undefined arguments from observer.next()
    }

    helperMethods(scope: Object): void {
      this.helpers = scope;
      this.state = this.state.set('helpers', Map<any,any>(scope));
      for (let x in scope) this[x] = scope[x];
    }

    // post() is the event hook setting function
    // pass in the hook event; 'save', 'remove', 'find'
    // pass in a callback function that will be executed upon event
    post(hook: string, fn: Function): void {
      switch (hook) {
        case "save":
          this.state = this.state
            .setIn(['events', 'postSaveCb'], fn);
          this['postSaveCb'] = fn;
          break;
        case "find":
          this.state = this.state
            .setIn(['events', 'postFindCb'], fn);
            this['postFindCb'] = fn;
          break;
        case "remove":
          this.state = this.state
            .setIn(['events', 'postRemoveCb'], fn);
            this['postRemoveCb'] = fn;
          break;
      }
      return;
    }
    // pre() is the event hook setting function
    // pass in the hook event; 'save', 'remove', 'find'
    // pass in a callback function with a next callback as an argument
    pre(hook: string, fn: Function): void {
      switch (hook) {
        case "save":
          this.state = this.state
            .setIn(['events', 'preSaveCb'], fn);
            this['preSaveCb'] = fn;
          break;
        case "find":
          this.state = this.state
            .setIn(['events', 'preFindCb'], fn);
            this['preFindCb'] = fn;
          break;
        case "remove":
          this.state = this.state
            .setIn(['events', 'preRemoveCb'], fn);
            this['preRemoveCb'] = fn;
          break;
      }
      return;
    }

  }

 /*
      Entity class is the object that will be instantiated with the DB response row data
        Entity holds it's cooresponding schema's current state and the item properties that is passed into it
        Entity has two basic functions, save() and remove() to UPDATE or DELETE the row it's properties relates to 
  */
 export class Entity {
   public toJSON: Function;
   private state: any;

   constructor(item: any, parent: Schema, isnew?: boolean) {
     // create functions for parent based off of the Schema state
     if (parent.helpers) this.integrateMethods(parent.helpers);
     // create class properties cooresponding to column values
     this.integrateItem(item, isnew ? isnew : false);
     // remove all exploitable properties from the item
     // when passed back through express response
     this.toJSON = function() {
       let obj = this;
       delete obj.state;
       return obj;
     };

     this.state = parent.state
       .delete('obs')
       .delete('batchable')
       .delete('tblChked')
       .delete('methods')
       .toJS();

     this.state['removeQ'] = this.removeQuery();
     // UPDATE query string
     this.state['saveQ'] = this.saveQuery();
   }
   // integrate the JSON into the parent object
   private integrateItem(item: any, isnew: boolean): void {
     for (let x in item) {
       const val = item[x];
       if (val && val !== 'now()' && val !== 'uuid()' && val !== 'toTimeStamp(now())' || isnew)
         this[x] = val;
     }
   }
   // integrate methods into parent object
   private integrateMethods(methods: any) {
     for (let x in methods) {
       this[x] = methods[x];
     }
   }
   // creates DELETE query string for this table
   private removeQuery(): string {
     let query: string = `DELETE FROM ${this.state.tableName} WHERE `;
     const keyList = this.state.model.keyList;

     for(let x = 0; x < keyList.length; x++) {
       query += `${keyList[x]} = ? AND `;
     }
     query = query.substring(0, query.length-4);

     return query;
   }

   // creates UPDATE query strign for this table
   private saveQuery(): string {
     let q1: string = `UPDATE ${this.state.tableName} SET `,
         q2: string = ` WHERE `;
     const keyList = this.state.model.keyList;
     const columnList = this.state.model.columnList;

     for(let x = 0; x < columnList.length; x++) {
       q1 += `${columnList[x]} = ?, `;
     }
     for(let y = 0; y < keyList.length; y++) {
       q2 += `${keyList[y]} = ? AND `;
     }

     return q1.substring(0, q1.length-2) + q2.substring(0, q2.length-4);
   }

   // UPDATEs the DB with the current object column values
   save(): Rx.Observable<any> {
     // two arrays for SET and WHERE
     let arr1 = [],
         arr2 = [];
     const keyList = this.state.model.keyList;
     const columnList = this.state.model.columnList;


     // For all columns in the table if column is not a key add to SET array
     // if column is a key add value to WHERE array
     for(let x = 0; x < columnList.length; x++) {
       arr1.push(this[columnList[x]]);
     }
     for(let y = 0; y < keyList.length; y++) {
       arr2.push(this[keyList[y]]);
     }

     // return observable that executes the UPDATE query with SET array + WHERE array as params
     return Rx.Observable.create(observer => {
       const func = () => cassandra.client.execute(this.state.saveQ, arr1.concat(arr2), {prepare:true});

       func().then(entity => {
         if(this.state.events && this.state.events.postSaveCb) { // if save Event hook set
           this.state.events.postSaveCb(this, x => { // execute save hook callback
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
     const keyList = this.state.model.keyList;

     // WHERE clause only cares about key values
     // push key values into WHERE array
     for(let y = 0; y < keyList.length; y++) {
       arr.push(this[keyList[y]]);
     }

     // create observable that executes the DELETE query with WHERE array as params
     return Rx.Observable.create(observer => {
       const func = () => cassandra.client.execute(this.state.removeQ, arr, {prepare:true});

       func().then(entity => {
         if(this.state.events.postRemoveCb) { // if remove Event hook set
           this.state.events.postRemoveCb(this, x => { // executes remvoe hook callback
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