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
    allCol: colName,
    columnList: objDiff(colName, keys),
    keyList: keys,
    defaults: defaults
  };
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
        // this.state = Map<any,any>(model);
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

        // this.state = Map<any,any>({
        //   obs: List<Rx.Observable<any>>([])
        // })
        // .set('model', Map<any,any>(parseModel(model)))
        // .set('tableName', modelName);

        if (options) this.options = options;
          // this.state = this.state.set('options', Map<any,any>(options));   

      }
    }

    /*
        PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
          THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
     */

    private createTable(obs: List<Rx.Observable<any>>): List<Rx.Observable<any>> {
      // immutablejs object update to push to obs List
      return obs.push(Rx.Observable.create(observer => {
        const table = this.tableName;
        const q1 = `CREATE TABLE IF NOT EXISTS ${ table } (${ this.model.columns }, PRIMARY KEY (${ this.model.keys }))`;   

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
        }).catch(err => observer.error(err));

        return function () {};

      }));
    }

    /*
        checktable() is used to check if tble query has ever been executed on the DB will only be executed once per Schema after server start
          if false, append create table query observable to obs List and return new state
          else, return passed state
     */
    private checkTable(obs: List<Rx.Observable<any>>): List<Rx.Observable<any>> {
      if (this.tblChked) { // if state.tblChked === false
        this.tblChked = true; // state.tblChked = true
        return this.createTable(obs); // createTable() will return new state with appended obs List
      }
      return obs;
    }

    newEntity(item: Object): Entity {
      const defaults = this.model.defaults;

      for (let x in defaults) {
        if (!item[x]) item[x] = defaults[x];
      }

      return new Entity(item, this);
    }

    /*
        PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
          THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
     */
    private parseQueryInsert(item: Entity, options: any): Rx.Observable<any> {

      return Rx.Observable.create(observer => {
        let params = [];
        // INSERT is a more complicated query that requires more feness
        // // separate query into two parts, columns & values
        let tmp1 = `INSERT INTO ${this.tableName} (`; // columns will be appended to this
        let tmp2 = `) VALUES (`; // values appended to this
        // for all keys in the current object
        for(let y in item.attributes) {
            const val = item[y]; // hold onto key's value for faster reads
            // check to make sure that value is not a DB function
            // if value is DB function
            if (val === 'now()' || val === 'uuid()' || val === 'toTimeStamp(now())') {
              tmp1 += `${y}, `; // append iteration's key to columns string
              tmp2 += `${val}, `; // function must be appended to values string
            } else { // if not a DB function
              tmp1 += `${y}, `; // append iteration's key to columns string
              tmp2 += '?, '; // appends '?' as necessary for prepared queries
              params.push(val); // push value into q's params array
            }
        }

        const query = tmp1.substring(0, tmp1.length-2) + tmp2.substring(0, tmp2.length-2) + ')'; // q's query string set to concat of columns and values string

        cassandra.client.execute(query, params, {prepare:true}).then(response => { // entity will be useless from DB
          if(item.postSaveCb) { // if save Event hook set
            item.postSaveCb(item, x => { // execute the save hook callback
              observer.next(x);
              observer.complete();
            }, cassandra.client);
          } else { // if no save hook set
            observer.next(item); // set next() argument to new Entity
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

    private parseQueryDelete(item: Entity, options: any): Rx.Observable<any> {

      return Rx.Observable.create(observer => {
          let params = [];

          let tmp = `DELETE FROM ${this.tableName} WHERE`; // set starting query string
          // for all keys in this item
          for(let y in item.attributes) {
            const val = item[y];            
            tmp += ` ${y} = ? AND`; // append key to query string
            params.push(val); // push value to params array          
          }
          const query = tmp.substring(0, tmp.length-4); // truncate last ' AND' on the string

          cassandra.client.execute(query, params, {prepare:true}).then(response => { // entity will be useless information about the DB
            if(item.postRemoveCb) { // if remvoe event hook was set
              item.postRemoveCb(item, x => { // execute remove hook callback
                observer.next(x);
                observer.complete();
              }, cassandra.client);
            } else { // if remvoe hook was not set
              observer.next(item); // set next() argument to new Entity aligned with items iteration
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
    private parseQueryUpdate(item: Entity, options: any): Rx.Observable<any> {

      return Rx.Observable.create(observer => {
          const keyList = this.model.keyList;
          const columnList = this.model.columnList;

          let params = [];
          // start query string at this base
          let tmp = `UPDATE ${this.tableName} SET`;

          // for all keys in the set object
          for(let y = 0; y < columnList.length; y++) {
            const columnVal = columnList[y];
            const itemVal = item[columnVal];
            if (itemVal) {
              tmp += ` ${columnVal} = ?, `; // append set attributes to query string
              params.push(itemVal); // push values to params array
            }
          }
          tmp = tmp.substring(0, tmp.length-2) + ' WHERE'; // truncate the last ', ' from the query string
          // append WHERE to continue the query string with keys in 'in' object
          // for all keys in the 'in' object
          for(let z = 0; z < keyList.length; z++) {
            const keyVal = keyList[z];
            const itemVal = item[keyVal];
            if (itemVal) {
              tmp += ` ${keyVal} = ? AND`; // append all 'in' keys to query string
              params.push(itemVal); // push key values to params array
            }
          }

          const query = tmp.substring(0, tmp.length-4) + ' IF EXISTS'; // set the query key in q array to new query string

          cassandra.client.execute(query, params, {prepare:true}).then(entity => { // if the event hook was set
            if(item.postSaveCb) { // in state.events.saveHook will indicator boolean
              // execute the hook callback and create newEntity object with current entity JSON
              item.postSaveCb(item, x => {
                observer.next(x);
                observer.complete();
              }, cassandra.client);
            } else { // if no hook was set
              observer.next(new Entity(item, this)); // next() arg is new Entity object
              observer.complete(); // now complete
            }
          }).catch(err => observer.error(err));

          return function(){};
      });

    }

    /*
        PARSES THE INPUTTED OBJECT
          THEN RETURNS AN OBSERVABLE QUERY 
     */
    private parseQuerySelect(item: Entity, options?: any): Rx.Observable<any> {

      return Rx.Observable.create(observer => {

        let query = `SELECT * FROM ${this.tableName} WHERE`; // start with a base query
        let params = []; // where params will be stored

        if (!item.isEmpty()) {
          // append to query string all columns and push values to params array
          for(let x in item.attributes) {
            query += ` ${x} = ? AND`;
            params.push(item[x]);
          }
          query = query.substring(0, query.length-4); // truncate last AND in the query string
        } else {
          query = `SELECT * FROM ${this.tableName}`;
        }
        if (options && options.limitOne) query += ' LIMIT 1';
        // options for allow filtering
        if (options && options.allowFiltering && params.length > 0) query += ' ALLOW FILTERING';

        cassandra.client.execute(query, params, {prepare:true}).then(entity => {
          // all rows in the response will be stored in a Entity class inside items array
          const rows = entity.rows;
          let items;

          if (rows.length === 0) {
            observer.error({ message: 'No Entities were found', statusCode: 404 });
          } else if (rows.length > 1) {
            items = [];
            for (let z = 0; z < rows.length; z++) {
              items.push(new Entity(rows[z], this))
            }
          } else {
            items = new Entity(rows[0] || {}, this);
          }

          // If the find event hook was initialized
          if(this.helper.postFindCb) { // if find Event hook set
            this.helper.postFindCb(items, x => { // execute the find hook callback
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
      let obs: any = List<Rx.Observable<any>>(this.obs);

      if (items) { // if items passed into function

        let preArr = []; // array to hold the preHook Observables
        let parseArr = []; // array to hold Query Observables
        // iterate through all items in the items array
        for (let x = 0; x < items.length; x++) {
          let item = new Entity(items[x], this);

          if (item.preRemoveCb) {
            preArr.push(Rx.Observable.create(observer => {
              item.preRemoveCb(item, () => {
                observer.next();
                observer.complete();
              }, err => observer.error(err));
            }));
          }

          parseArr.push(this.parseQueryDelete(item, options));
        }

        if (this.helper.preRemoveCb) {
          let pre = preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0];
          obs = this.checkTable(obs).push(pre);
        }

        obs = this.checkTable(obs).concat(parseArr);

      } else { // if no items sent to the remove function

        obs = this.checkTable(obs).push(Rx.Observable.create(observer => {
          cassandra.client.execute(`TRUNCATE ${this.tableName}`).then(entity => { // entity will be useless information about DB
            observer.next(); // no argument set for next()
            observer.complete();
          }).catch(err => observer.error(err));

          return function() {};
        }));

      }

      return new Schema(this, obs);
    }

    /*
        USES THE PARSED OBJECT FROM FIND() OR FINDONE() 
        AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
        EXECUTE FUNCTION

        UPDATE() IS USED FOR UPDATING EXISTING ROW(S)
        IN THE TABLE
     */

    update(items: any, options: Object = {}): Schema {
      let obs: any = List<Rx.Observable<any>>(this.obs); // create new state object 
      items = Array.isArray(items) ? items : [items]; // if items is not an array, make it one

      let preArr = []; // array to hold the preHook Observables
      let parseArr = []; // array to hold Query Observables
      // iterate through all items in the items array
      for (let x = 0; x < items.length; x++) {
        const object = items[x];
        let item = new Entity(object.set, this);
        item.merge(object.where);

        if (item.preSaveCb) {
          preArr.push(Rx.Observable.create(observer => {
            item.preSaveCb(item, () => {
              observer.next();
              observer.complete();
            }, err => observer.error(err));
          }));
        }

        parseArr.push(this.parseQueryUpdate(item, options));
      }

      if (this.helper.preSaveCb) {  
        obs = this.checkTable(obs).push(preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0]);
      }

      obs = this.checkTable(obs).concat(parseArr);

      return new Schema(this, obs);
    }

    /*
          CREATE A NEW ROW IN THE INSTANCE TABLE
            USES CASS DRIVER BATCH FUNCTION TO INSERT PARSED OBJECT ARRAY
     */

    create(items: any, options?: Object): Schema { 
      let obs: any = List<Rx.Observable<any>>(this.obs);
      items = Array.isArray(items) ? items : [items];

      let preArr = [];
      let parseArr = [];

      // create a read only pointer to a new object from the defaults Map
      const defaults = this.model.defaults;
      // merge default values with each item in the items array
      for(let x = 0; x < items.length; x++) {
        let item = items[x];
        // Any value that has a default but is not indicated in the item will be default
        for(let y in defaults) { // go through all items in object
          if (!item[y]) item[y] = defaults[y]; // if a default property does not exist, make it
        }
        item = new Entity(item, this);

        if (item.preSaveCb) {
          preArr.push(Rx.Observable.create(observer => {
            item.preSaveCb(() => {
              observer.next();
              observer.complete();
            }, err => observer.error(err));
          }));
        }

        parseArr.push(this.parseQueryInsert(item, options));
      }

      if (this.helper.preSaveCb) {
        obs = this.checkTable(obs).push(preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0]);
      } 

      obs = this.checkTable(obs).concat(parseArr);

      return new Schema(this, obs);
    }
    
    /*
          PARSES ATTR INTO FINDS OBJECT TO THEN QUERY THE DB
     */

    find(object?: Object, options?: any): Schema {
      let obs = List<Rx.Observable<any>>(this.obs);
      let item: Entity = new Entity(object || {}, this);

      if (this.helper.preFindCb) {
        obs = this.checkTable(obs).push(Rx.Observable.create(observer => {
          item.preFindCb(() => {
            observer.next();
            observer.complete();
          }, err => observer.error(err));
        }));
      }
      
      obs = this.checkTable(obs).push(this.parseQuerySelect(item, options));

      return new Schema(this, obs);
    }
   
    /*
          CHANGES THE FIND1 VARIABLE TO TRUE
            THIS WILL CAUSE EXEC TO LIMIT THE QUERY TO 1
     */

    findOne(object?: Object, options?: any): Schema {
      let obs = List<Rx.Observable<any>>(this.obs);
      let item: Entity = new Entity(object || {}, this);

      if (!options) options = {};
      options.limitOne = true; // Make sure we limit the response to one row

      if (this.helper.preFindCb) {
        obs = this.checkTable(obs).push(Rx.Observable.create(observer => {
          item.preFindCb(() => {
            observer.next();
            observer.complete();
          }, err => observer.error(err));
        }));
      }
      
      obs = this.checkTable(obs).push(this.parseQuerySelect(item, options));

      return new Schema(this, obs);
    }

    /*
          SELECTS FROM THE DATABASE WITH ONLY AN ID
            IF NO ID SET IN THE MODEL THIS SHOULD BE A UUID THAT HAS A SECONDARY INDEX
     */
    findById(id: string): Schema {
      let obs = List<Rx.Observable<any>>(this.obs);
      let item: Entity = new Entity({ id : id }, this);

      if (this.helper.preFindCb) {
        obs = this.checkTable(obs).push(Rx.Observable.create(observer => {
          item.preFindCb(() => {
            observer.next();
            observer.complete();
          }, err => observer.error(err));
        }));
      }

      obs = this.checkTable(obs).push(Rx.Observable.create(observer => {
        const query = `SELECT * FROM ${this.state.get('tableName')} WHERE id = ${id}`

        cassandra.client.execute(query).then(entity => {
          // all rows in the response will be stored in a Entity class inside items array
          const rows = entity.rows;
          let items;

          if (rows.length === 0) {
            observer.error({ message: 'No Entities were found', statusCode: 404 });
          } else if (rows.length > 1) {
            items = [];
            for (let z = 0; z < rows.length; z++) {
              items.push(new Entity(rows[z], this))
            }
          } else {
            items = new Entity(rows[0] || {}, this);
          }

          // If the find event hook was initialized
          if(this.helper.postFindCb) { // if find Event hook set
            this.helper.postFindCb(items, x => { // execute the find hook callback
              observer.next(x);
              observer.complete();
            }, cassandra.client);
          } else { // if no find hook set
            observer.next(items); // set next() argument to Entity array
            observer.complete();
          }
        }).catch(err => observer.error(err));

        return function () {};
      }));

      return new Schema(this, obs);
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

      const seamed = this.obs.size > 1 ? 
        Rx.Observable.concat.apply(this, this.obs.toArray()) : 
        this.obs.first();

      return seamed.filter(x => x); // filter out any undefined arguments from observer.next()
    }

    // post() is the event hook setting function
    // pass in the hook event; 'save', 'remove', 'find'
    // pass in a callback function that will be executed upon event
    post(hook: string, fn: Function): void {
      switch (hook) {
        case "save":
          this.helper.postSaveCb = fn;
          break;
        case "find":
            this.helper.postFindCb = fn;
          break;
        case "remove":
            this.helper.postRemoveCb = fn;
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
            this.helper.preSaveCb = fn;
          break;
        case "find":
            this.helper.preFindCb = fn;
          break;
        case "remove":
            this.helper.preRemoveCb = fn;
          break;
      }
      return;
    }

  }

 class Helper {
   private preSaveCb: Function;
   private preRemoveCb: Function;
   private preFindCb: Function;
   private postSaveCb: Function;
   private postRemoveCb: Function;
   private postFindCb: Function;

   constructor() {

   }

   methods(scope: Object): void {
     for (let x in scope) this[x] = scope[x];
   }
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

   public preSaveCb: Function;
   public preRemoveCb: Function;
   public preFindCb: Function;
   public postSaveCb: Function;
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
     // console.log(this);
   }
   // integrate the JSON into the parent object
   private integrateItem(item: any): void {
     const cols = this.model.allCol;

     for (let y = 0; y < cols.length; y++) {
       let prop = cols[y];
       let val = item[prop];

       this[prop] = val;
       this.attributes[prop] = val;

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
   save(): Rx.Observable<any> {
     // observable that executes the UPDATE query with SET array + WHERE array as params
     return Rx.Observable.create(observer => {
       // two arrays for SET and WHERE
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
         if (this[val]) {
           q2 += `${val} = ? AND `;
           arr2.push(this[val]);
         }
       }

       cassandra.client.execute(q1.substring(0, q1.length-2) + q2.substring(0, q2.length-4), 
         arr1.concat(arr2), {prepare:true}).then(entity => {

         if(this.postSaveCb) { // if save Event hook set
           this.postSaveCb(this, x => { // execute save hook callback
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

       cassandra.client.execute(query.substring(0, query.length-4), arr, {prepare:true}).then(entity => {
         if(this.postRemoveCb) { // if remove Event hook set
           this.postRemoveCb(this, x => { // executes remvoe hook callback
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