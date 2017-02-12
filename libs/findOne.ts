import * as Rx from 'rxjs';
import { List, Map } from 'immutable';
import { cassandra, Entity } from '../index';

/*
      CHANGES THE FIND1 VARIABLE TO TRUE
        THIS WILL CAUSE EXEC TO LIMIT THE QUERY TO 1
 */

export function findOne(object?: Object, opts?: any, state?: Map<any,any>) {
  state = state ? state : this.state;

  let query = `SELECT * FROM ${state.get('tableName')} WHERE`; // initialize query string to base starting query
  let params = []; // initialize params array

  if (object) { // if object is not undefined
    // for each key in object
    for(let x in object) {
      query += ` ${x} = ? AND`; // append key to query string
      params.push(object[x]); // push value to params array
    }
    query = query.substring(0, query.length-4); // truncate last ' AND' from query string

  } else { // if object is undefined select all from table
    query = `SELECT * FROM ${state.get('tableName')}`;
  }

  query += ' LIMIT 1'; // findOne limits to one row
  if (opts && opts.allowFiltering && params.length > 0) query += ' ALLOW FILTERING'; // if allow filtering option is set append ALLOW FILTERING
  // create new observable to push into parent state's observable List
  state = this.checkTable(state).update('obs', obs => obs.push(Rx.Observable.create(observer => {
    // create function to execute query whether object or no object
    let func = () => params.length > 0 ? cassandra.client.execute(query, params, {prepare:true}) : cassandra.client.execute(query);
    // execute function when subscribe() and wait for promise
    func().then(entity => { // entity will be the object passed from DB, it WILL have all rows found in entity.rows array
      if(state.getIn(['events', 'findHook'])) { // if find Event hook set
        state.getIn(['events', 'findCb'])(new Entity(entity.rows[0], state), x => {
          observer.next(x);
          observer.complete();
        }, cassandra.client); // execute
      } else { // if no find hook set
        // pass Enttiy object in next() argument if there was rows found
        entity.rows.length > 0 ? observer.next(new Entity(entity.rows[0], state)) : observer.next();
        observer.complete();
      }
    }).catch(err => observer.error(err));

    return function () {};

  })));    

  return {
    state: state.set('batchable', List<any>([])), // make sure parent state's batchable List is empty after

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