import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
      CHANGES THE FIND1 VARIABLE TO TRUE
        THIS WILL CAUSE EXEC TO LIMIT THE QUERY TO 1
 */

export function findOne(object?: Object, opts?: any) {

  let obs = this.checkTable(this.obs.concat([])).push(Rx.Observable.create(observer => {

    let func = () => {
      let query = `SELECT * FROM ${this.tableName} WHERE`;
      let params = [];

      if (object) {

        for(let x in object) {
          query += ` ${x} = ? AND`;
          params.push(object[x]);
        }
        query = query.substring(0, query.length-4); 

      } else {
        query = `SELECT * FROM ${this.tableName}`;
      }

      query += ' LIMIT 1';
      if (opts && opts.allowFiltering && params.length > 0) query += ' ALLOW FILTERING';

      return params.length > 0 ? cassandra.client.execute(query, params, {prepare:true}) : cassandra.client.execute(query);
    };

    func().then(entity => {
      if(this.findHook) {
        this.findCb(observer, entity, cassandra.client);
      } else {
        observer.next(entity);
        observer.complete();
      }
    }).catch(err => observer.error(err));

    return function () {};

  }));      

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
    batchable: List<any>([]),
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