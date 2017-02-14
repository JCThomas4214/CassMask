import * as Rx from 'rxjs';
import { List, Map } from 'immutable';
import { cassandra } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryUpdate(items: any, options: any, state: Map<any,any>) {
  let q = [];

  for(let x=0; x < items.length; x++) {
    q.push({ query: '', params: [] });

    let tmp = `UPDATE ${state.get('tableName')} SET`;

    for(let y in items[x].set) {
      tmp += ` ${y} = ?, `;
      q[x].params.push(items[x].set[y]);
    }
    tmp = tmp.substring(0, tmp.length-2);
    tmp += ' WHERE';

    for(let z in items[x].in) {
      tmp += ` ${z} = ? AND`;
      q[x].params.push(items[x].in[z]);
    }
    
    tmp = tmp.substring(0, tmp.length-4);
    tmp += ' IF EXISTS';

    q[x].query = tmp;

    if (!options.batch) {
      state = this.checkTable(state).updateIn(['obs'], obs => obs.push(Rx.Observable.create(observer => {

        const func = () => cassandra.client.execute(q[x].query, q[x].params, {prepare:true});

        func().then(entity => {
          if(state.get('updateHook')) {
            state.get('updateCb')(observer, items[x], cassandra.client);
          } else {
            observer.next(entity);
            observer.complete();
          }
        }).catch(err => observer.error(err));

        return function(){};
      })));
    } 

  }

  if (options.batch) {
    state = this.checkTable(state).updateIn(['obs'], obs => obs.push(Rx.Observable.create(observer => {

      const func = () => cassandra.client.batch(state.get('batchable').concat(q).toArray(), {prepare:true});

      func().then(entity => {
        if(state.get('updateHook')) {
          state.get('updateCb')(observer, items, cassandra.client);
        } else {
          observer.next(entity);
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
    USES THE PARSED OBJECT FROM FIND() OR FINDONE() 
    AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
    EXECUTE FUNCTION

    UPDATE() IS USED FOR UPDATING EXISTING ROW(S)
    IN THE TABLE
 */

export function update(object: any, options: Object = {}, state?: Map<any,any>) {
  const st = state ? state : this.state.concat({});

  return Array.isArray(object) ? this.parseQueryUpdate(object, options, st) : this.parseQueryUpdate([object], options, st);
}