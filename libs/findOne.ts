import * as Rx from 'rxjs';
import { List, Map } from 'immutable';
import { cassandra, IState } from '../index';
import { Model } from './model';

/*
      CHANGES THE FIND1 VARIABLE TO TRUE
        THIS WILL CAUSE EXEC TO LIMIT THE QUERY TO 1
 */

export function findOne(object?: Object, opts?: any, state?: Map<IState, IState>) {

  const st = this.checkTable(state ? state : this.state).updateIn(['obs'], obs => obs.push(Rx.Observable.create(observer => {

    let func = () => {
      let query = `SELECT * FROM ${st.get('tableName')} WHERE`;
      let params = [];

      if (object) {

        for(let x in object) {
          query += ` ${x} = ? AND`;
          params.push(object[x]);
        }
        query = query.substring(0, query.length-4); 

      } else {
        query = `SELECT * FROM ${st.get('tableName')}`;
      }

      query += ' LIMIT 1';
      if (opts && opts.allowFiltering && params.length > 0) query += ' ALLOW FILTERING';

      return params.length > 0 ? cassandra.client.execute(query, params, {prepare:true}) : cassandra.client.execute(query);
    };

    func().then(entity => {
      if(st.get('findHook')) {
        st.get('findCb')(observer, entity, cassandra.client);
      } else {
        entity.rows ? observer.next(new Model(entity.rows[0], st.delete('obs').delete('batchable'))) : observer.next();
        observer.complete();
      }
    }).catch(err => observer.error(err));

    return function () {};

  })));    

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