import * as Rx from 'rxjs';
import { List, Map } from 'immutable';
import { cassandra, Entity } from '../index';

/*
      PARSES ATTR INTO FINDS OBJECT TO THEN QUERY THE DB
 */

export function find(object?: Object, opts?: any, state?: Map<any,any>) {
  state = state ? state : this.state;

  let query = `SELECT * FROM ${state.get('tableName')} WHERE`; // start with a base query
  let params = []; // where params will be stored

  if (object) { // determine if object argument exist
    // append to query string all columns and push values to params array
    for(let x in object) {
      query += ` ${x} = ? AND`;
      params.push(object[x]);
    }
    query = query.substring(0, query.length-4); // truncate last AND in the query string

  }
  // if params length is 0 the object was empty or did not exist
  // continue with a SELECT everything
  if (params.length === 0) query = `SELECT * FROM ${state.get('tableName')}`;
  // options for allow filtering
  if (opts && opts.allowFiltering && params.length > 0) query += ' ALLOW FILTERING';

  // Create a new state object that will be updated accordingly if Table was never checked
  // Once the Table was checked update the next Objects observable List with the find() query
  state = this.checkTable(state).update('obs', obs => obs.push(Rx.Observable.create(observer => {

    let func = () => cassandra.client.execute(query, params, {prepare:true});

    // execute function and wait for response from DB
    func().then(entity => {
      // all rows in the response will be stored in a Entity class inside items array
      let items = [];
      entity.rows.forEach(val => items.push(new Entity(val, state)));
      // make items a single object if only one object exists in the array
      items = items.length > 1 ? items : items[0];

      // If the find event hook was initialized
      if(state.getIn(['events','findHook'])) { // if find Event hook set
        state.getIn(['events','findCb'])(items, x => { // execute the find hook callback
          observer.next(x);
          observer.complete();
        }, cassandra.client);
      } else { // if no find hook set
        observer.next(items); // set next() argument to Entity array
        observer.complete();
      }
    }).catch(err => observer.error(err));

    return function () {};

  })));

  return {
    state: state.set('batchable', List<any>([])), // make sure after find() the parent state's batchable Lit is empty

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
