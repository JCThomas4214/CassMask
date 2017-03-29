import { client } from '../index';
import { SchemaHelper } from './schema';
import * as Rx from 'rxjs';

export function createTableQuery(schemaHelper: SchemaHelper) {
  return `CREATE TABLE IF NOT EXISTS ${ schemaHelper.tableName } (${ schemaHelper.columns }, PRIMARY KEY (${ schemaHelper.keys }))`;
}

export function indexQuery(indexName: string, indexGroup: string, schemaHelper: SchemaHelper) {
  return `CREATE CUSTOM INDEX ${ schemaHelper.tableName }_${indexName} on ${ schemaHelper.tableName } (${indexGroup}) using 'org.apache.cassandra.index.sasi.SASIIndex'`;
}

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function createTable(obs: Rx.Observable<any>, schemaHelper: SchemaHelper): Rx.Observable<any> {

  // object update to push to obs Array
  let newObs = Rx.Observable.create(observer => {
      const q1 = createTableQuery(schemaHelper);   
      
      let indexes = schemaHelper.indexes;
      let createIndexes = [];

      client.execute(q1).then(entity => { // observer2 will not pass any arguments from the query
        for(let x = 0; x < indexes.length; x++) {
          const indexName = indexes[x].join('_');
          const indexGroup = indexes[x].join(', ');

          const q2 = indexQuery(indexName, indexGroup, schemaHelper); 

          createIndexes.push(Rx.Observable.create(observer2 => {
            client.execute(q2).then(entity => {
              observer2.next();
              observer2.complete();
            }).catch(err => {
              observer2.next();
              observer2.complete();
            });   
          }));
        }

        // when subscribe() execute create table query
        const indexObs = createIndexes.length > 1 ? Rx.Observable.merge.apply(this, createIndexes) : createIndexes[0];
        indexObs.subscribe(x => {}, err => observer.error(err), () => {
          observer.next();
          observer.complete();
        });
      }).catch(err => {
        observer.error(err);
      });

      return function () {};

    });

    return newObs.concat(obs);
}

/*
    checktable() is used to check if tble query has ever been executed on the DB will only be executed once per Schema after server start
      if false, append create table query observable to obs Array and return new state
      else, return passed state
 */
export function checkTable(obs: Rx.Observable<any>, schemaHelper: SchemaHelper): Rx.Observable<any> {
  if (!schemaHelper.tblChked) { // if state.tblChked === false
    schemaHelper.tblChked = true; // state.tblChked = true
    return createTable(obs, schemaHelper); // createTable() will return new state with appended obs List
  }
  return obs;
}