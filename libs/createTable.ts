import * as Rx from 'rxjs';
import { List } from 'immutable';
import cassandra from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function createTable() {
  return this.obs.push(Rx.Observable.create(observer => {

    let func = () => {
      const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${ this.model.columns }, PRIMARY KEY (${ this.model.keys }))`;   
      return cassandra.client.execute(query);
    };

    func().then(entity => {
      observer.next(entity);
      observer.complete();
    }).catch(err => observer.error(err));

    return function () {};

  }));
}

export function checkTable() {
  if (!this.tblChked) {
    this.tblChked = true;
    return this.createTable();
  }
  return this.obs;
}