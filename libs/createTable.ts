import * as Rx from 'rxjs';
import { List, Map } from 'immutable';
import { cassandra } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function createTable(state: Map<any,any>): Map<any,any> {
  // immutablejs object update to push to obs List
  return state.update('obs', obs => obs.push(Rx.Observable.create(observer => {

    let func = () => { // function to create table in the DB IF IS DOES NOT EXIST ON THE DB
      const query = `CREATE TABLE IF NOT EXISTS ${ this.state.get('tableName') } (${ this.state.getIn(['model', 'columns']) }, PRIMARY KEY (${ this.state.getIn(['model', 'keys']) }))`;   
      return cassandra.client.execute(query);
    };
    // when subscribe() execute create table query
    func().then(entity => { // observer will not pass any arguments from the query
      observer.next();
      observer.complete();
    }).catch(err => observer.error(err));

    return function () {};

  })));
}

/*
    checktable() is used to check if tble query has ever been executed on the DB will only be executed once per Schema after server start
      if false, append create table query observable to obs List and return new state
      else, return passed state
 */
export function checkTable(state: Map<any,any>): Map<any,any> {
  if (!state.get('tblChked')) { // if state.tblChked === false
    state = state.set('tblChked', true); // state.tblChked = true
    return this.createTable(state); // createTable() will return new state with appended obs List
  }
  return state;
}