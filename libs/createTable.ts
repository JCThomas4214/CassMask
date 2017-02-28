'use strict';

import { cassandra } from '../index';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function createTable(obs: List<Rx.Observable<any>>): List<Rx.Observable<any>> {
  // immutablejs object update to push to obs List
  return obs.push(Rx.Observable.create(observer => {
    const table = this.tableName;
    const q1 = `CREATE TABLE IF NOT EXISTS ${ table } (${ this.model.columns }, PRIMARY KEY (${ this.model.keys }))`;   

    // when subscribe() execute create table query
    cassandra.client.execute(q1).then(entity => { // observer will not pass any arguments from the query
      const q2 = `CREATE CUSTOM INDEX ${ table }_id on ${ table } (id) using 'org.apache.cassandra.index.sasi.SASIIndex'`;
      cassandra.client.execute(q2).then(entity => {
        observer.next();
        observer.complete();
      }).catch(err => {
        observer.next();
        observer.complete();
      });
    }).catch(err => observer.error(err));

    return function () {};

  }));
}

/*
    checktable() is used to check if tble query has ever been executed on the DB will only be executed once per Schema after server start
      if false, append create table query observable to obs List and return new state
      else, return passed state
 */
export function checkTable(obs: List<Rx.Observable<any>>): List<Rx.Observable<any>> {
  if (this.tblChked) { // if state.tblChked === false
    this.tblChked = true; // state.tblChked = true
    return this.createTable(obs); // createTable() will return new state with appended obs List
  }
  return obs;
}