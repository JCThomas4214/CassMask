import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
      PARSES ATTR INTO FINDS OBJECT TO THEN QUERY THE DB
 */

export function find(object?: Object, opts?: any, state?: Map<any,any>) {

  const st = this.checkTable(state ? state : this.state).push(Rx.Observable.create(observer => {

    let func = () => {
      let query = `SELECT * FROM ${this.state.get('tableName')} WHERE`;
      let params = [];

      if (object) {

        for(let x in object) {
          query += ` ${x} = ? AND`;
          params.push(object[x]);
        }
        query = query.substring(0, query.length-4);

      }

      if (params.length === 0) query = `SELECT * FROM ${st.get('tableName')}`;
      if (opts && opts.allowFiltering && params.length > 0) query += ' ALLOW FILTERING';

      return cassandra.client.execute(query, params, {prepare:true});          
    };

    func().then(entity => {
      if(st.get('findHook')) {
        st.get('findCb')(observer, entity, cassandra.client);
      } else {
        observer.next(entity);
        observer.complete();
      }
    }).catch(err => observer.error(err));

    return function () {};

  }));

  return {
    state: st.set('batchable', List<any>([])),

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
