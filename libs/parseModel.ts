import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
    PARSES THE MODEL SENT INTO THE CONTRUCTOR
      WILL CREATE A KEY VALUE ARRAY TO USE IN 
      LATER FUNCTIONS
 */

export function parseModel(model: any): any {
  let columns = [], // array for column names and data type
      colName = [] // array for column names only
  // for every key in the model JSON
  for (let x in model) { 
    if (x !== 'keys') { // if key is not the PRIMARY KEYS, 'keys'
      columns.push(`${ x } ${ model[x] }`); // push name and datatype to columns array
      colName.push(x); // push only column name to colName array
    }
  }
  // return model object that will be used for query functions
  return {
    columns: columns.join(', '),
    keys: model['keys'].join(', '),
    columnList: List<any>(colName),
    keyList: List<any>(model['keys'])
  };
}