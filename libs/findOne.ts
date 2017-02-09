import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
      CHANGES THE FIND1 VARIABLE TO TRUE
        THIS WILL CAUSE EXEC TO LIMIT THE QUERY TO 1
 */

export function findOne(object?: Object, opts?: any) {

  let obs = this.createBatchQuery(this.obs.concat([])).push(Rx.Observable.create(observer => {

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

      return cassandra.client.execute(query, params, {prepare:true});
    };

    func().then(entity => {
      observer.next(entity);
      observer.complete();
    }).catch(err => observer.error(err));

    return function () {};

  }));      

  return {
    tblChked: this.tblChked,
    model: this.model,
    tableName: this.tableName,        
    obs: obs.concat([]),
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