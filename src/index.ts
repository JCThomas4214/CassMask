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

export let client;

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

    insertJsonBatch(obj: Array<Object>, options: Object): Rx.Observable<any> {
      return Rx.Observable.create(observer => {

        let queries = [];

        for(let x = 0; x < obj.length; x++) { 
          queries.push({query: `INSERT INTO ${this.schemaHelper.tableName} JSON '${JSON.stringify(obj[x])}'`});
        }
        
        client.batch(queries).then(entity => {
          observer.next();
          observer.complete();
        }).catch(err => observer.error(err));

      });
    }

  }

  export * from './libs/dataTypes';
  export {Entity, Schema};
