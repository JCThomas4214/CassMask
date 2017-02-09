import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
    PARSES THE MODEL SENT INTO THE CONTRUCTOR
      WILL CREATE A KEY VALUE ARRAY TO USE IN 
      LATER FUNCTIONS
 */

export function parseModel(model: any): any {
  let columns = [];

  for (let x in model) {
    if (x !== 'keys') {
      columns.push(`${ x } ${ model[x] }`);
    }
  }

  return {
    columns: columns.join(', '),
    keys: model['keys'].join(', ')
  };
}