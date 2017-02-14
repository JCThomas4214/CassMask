import * as Rx from 'rxjs';
import { List, Map } from 'immutable';
import { cassandra, IState } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function createTable(state: Map<IState, IState>): Map<IState, IState> {
  return state.updateIn(['obs'], obs => obs.push(Rx.Observable.create(observer => {

    let func = () => {
      const query = `CREATE TABLE IF NOT EXISTS ${ this.state.get('tableName') } (${ this.state.getIn(['model', 'columns']) }, PRIMARY KEY (${ this.state.getIn(['model', 'keys']) }))`;   
      return cassandra.client.execute(query);
    };

    func().then(entity => {
      observer.next();
      observer.complete();
    }).catch(err => observer.error(err));

    return function () {};

  })));
}

export function checkTable(state: Map<any,any>): Map<any,any> {
  if (!state.get('tblChked')) {
    state = state.set('tblChked', true);
    return this.createTable(state);
  }
  return state;
}