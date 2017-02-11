import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryInsert(items: any, options: any) {
  let q = [];
  let obs = this.obs.concat([]);

  for(let x=0; x < items.length; x++) {
    q.push({ query: '', params: [] });

    let tmp1 = `INSERT INTO ${this.tableName} (`;
    let tmp2 = `) VALUES (`;

    for(let y in items[x]) {
        const item = items[x][y];
        tmp1 += `${y}, `;

        if (item === 'now()' || 
          item === 'uuid()' || 
          item === 'toTimeStamp(now())') {

          tmp2 += `${item}, `;

        } else {

          tmp2 += '?, ';
          q[x].params.push(item);

        }

    }

    tmp1 = tmp1.substring(0, tmp1.length-2);
    tmp2 = tmp2.substring(0, tmp2.length-2) + ')';

    q[x].query = tmp1 + tmp2;

    if (!options.batch) {
      obs = this.checkTable(obs).push(Rx.Observable.create(observer => {

        const func = () => cassandra.client.execute(q[x].query, q[x].params, {prepare:true});

        func().then(entity => {
          if(this.createHook) {
            this.createCb(observer, entity, cassandra.client);
          } else {
            observer.next(entity);
            observer.complete();
          }
        }).catch(err => observer.error(err));

        return function(){};
      }));
    } 

  }

  if (options.batch) {
    obs = this.checkTable(obs).push(Rx.Observable.create(observer => {

      const func = () => cassandra.client.batch(this.batchable.concat(q).toArray(), {prepare:true});

      func().then(entity => {
        if(this.createHook) {
          this.createCb(observer, entity, cassandra.client);
        } else {
          observer.next(entity);
          observer.complete();
        }
      }).catch(err => observer.error(err));

      return function(){};
    }));
  } 

  // console.log(obs.toArray());

  return {
    createHook: this.createHook,
    updateHook: this.updateHook,
    removeHook: this.removeHook,
    findHook: this.findHook,
    createCb: this.createCb,
    updateCb: this.updateCb,
    removeCb: this.removeCb,
    findCb: this.findCb,    

    tblChked: this.tblChked,
    model: this.model,
    tableName: this.tableName,        
    obs: obs,
    batchable: this.batchable,
    createBatchQuery: this.createBatchQuery,
    parseQueryInsert: this.parseQueryInsert,
    parseQueryUpdate: this.parseQueryUpdate,
    parseQueryDelete: this.parseQueryDelete,

    seam: this.seam,
    remove: this.remove,
    create: this.create,
    find: this.find,
    findOne: this.findOne,
    update: this.update,

    checkTable: this.checkTable,
    createTable: this.createTable
  };
}

/*
      CREATE A NEW ROW IN THE INSTANCE TABLE
        USES CASS DRIVER BATCH FUNCTION TO INSERT PARSED OBJECT ARRAY
 */

export function create(items: any, options: Object = {}) {
  return Array.isArray(items) ? this.parseQueryInsert(items, options) : this.parseQueryInsert([items], options);
}