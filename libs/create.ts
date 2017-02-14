import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryInsert(items: any, options: any, state: Map<any,any>) {
  let q = [];

  for(let x=0; x < items.length; x++) {
    q.push({ query: '', params: [] });

    let tmp1 = `INSERT INTO ${this.state.get('tableName')} (`;
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
      state = this.checkTable(state).updateIn(['obs'], obs => obs.push(Rx.Observable.create(observer => {

        const func = () => cassandra.client.execute(q[x].query, q[x].params, {prepare:true});

        func().then(entity => {
          if(this.state.get('createHook')) {
            this.state.get('createCb')(observer, items[x], cassandra.client);
          } else {
            observer.next();
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
        if(this.state.get('createHook')) {
          this.state.get('createCb')(observer, items, cassandra.client);
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
      CREATE A NEW ROW IN THE INSTANCE TABLE
        USES CASS DRIVER BATCH FUNCTION TO INSERT PARSED OBJECT ARRAY
 */

export function create(items: any, options: Object = {}, state?: Map<any,any>) {  
  const st = state ? state : this.state.concat({});

  return Array.isArray(items) ? this.parseQueryInsert(items, options, st) : this.parseQueryInsert([items], options, st);
}