import * as Rx from 'rxjs';
import { List, Map } from 'immutable';
import { cassandra } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryDelete(items: any, options: any, state: Map<any,any>) {
  let q = [];

  for(let x=0; x < items.length; x++) {
    q.push({ query: '', params: [] });

    let tmp = `DELETE FROM ${state.get('tableName')} WHERE`;

    for(let y in items[x]) {
      tmp += ` ${y} = ? AND`;
      q[x].params.push(items[x][y]);
    }
    q[x].query = tmp.substring(0, tmp.length-4);

    if (!options.batch && q[0].params.length > 0) {
      state = this.checkTable(state).updateIn(['obs'], obs => obs.push(Rx.Observable.create(observer => {

        const func = () => cassandra.client.execute(q[x].query, q[x].params, {prepare:true});

        func().then(entity => {
          if(state.get('removeHook')) {
            state.get('removeCb')(observer, items[x], cassandra.client);
          } else {
            observer.next();
            observer.complete();
          }
        }).catch(err => observer.error(err));

        return function(){};
      })));
    } 

  }

  if (q[0].params.length === 0) {
    state = this.checkTable(state)
      .updateIn(['obs'], obs => obs.push(Rx.Observable.create(observer => {

        let func = () => cassandra.client.execute(`TRUNCATE ${state.get('tableName')}`);

        func().then(entity => {
          observer.next();
          observer.complete();
        }).catch(err => observer.error(err));

        return function() {};
      })))
      .updateIn(['batchable'], batchable => List<any>([]));
      
  } else if (options.batch) {
    state = this.checkTable(state).updateIn(['obs'], obs => obs.push(Rx.Observable.create(observer => {

      const func = () => cassandra.client.batch(state.get('batchable').concat(q).toArray(), {prepare:true});

      func().then(entity => {
        if(state.get('removeHook')) {
          state.get('removeCb')(observer, items, cassandra.client);
        } else {
          observer.next();
          observer.complete();
        }
      }).catch(err => observer.error(err));

      return function(){};
    })));
  }

  // console.log(obs.toArray());

  return {
    state: state,

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
    USES THE PARED OBJECT FROM FIND() OR FINDONE() 
    AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
    EXECUTE FUNCTION

    REMOVE() IS FOR DELETING FOUND ROWS OR TRUNCATING TABLE
 */

export function remove(object: any = {}, options: Object = {}, state?: Map<any,any>) { 
    const st = state ? state : this.state.concat({});

    return Array.isArray(object) ? this.parseQueryDelete(object, options, st) : this.parseQueryDelete([object], options, st);
}