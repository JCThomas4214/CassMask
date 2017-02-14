import { List, Map } from 'immutable';
import { cassandra } from '../index';
import * as Rx from 'rxjs';

export class Model {
  private saveQ: string;
  private removeQ: string;

  private keyList: List<string>;
  private columnList: List<string>;

  constructor(item: any, state: Map<any,any>) {

    for (let x in item) this[x] = item[x];

    this.removeQ = this.removeQuery(state);
    console.log(this.removeQ);
    this.saveQ = this.saveQuery(state);
    console.log(this.saveQ);

    this.keyList = state.getIn(['model', 'keyArr']);
    this.columnList = state.getIn(['model', 'columnArr']);
  }

  private removeQuery(state: Map<any,any>): string {
    let query: string = `DELETE FROM ${state.get('tableName')} WHERE `;

    state.getIn(['model', 'keyArr']).forEach((val, index) => {
      query += `${val} = ? AND `;
    });
    query = query.substring(0, query.length-4);

    return query;
  }

  private saveQuery(state: Map<any,any>): string {
    let q1: string = `UPDATE ${state.get('tableName')} SET `,
        q2: string = ` WHERE `;

    state.getIn(['model', 'columnArr']).forEach((val, index) => {
      if (!state.getIn(['model', 'keyArr']).includes(val)) q1 += `${val} = ?, `;
      else q2 += `${val} = ? AND `;
    });
    return q1.substring(0, q1.length-2) + q2.substring(0, q2.length-4);
  }

  save() {
    let arr1 = [],
        arr2 = [];

    this.columnList.forEach(val => {
      if (!this.keyList.includes(val)) arr1.push(this[val]);
      else arr2.push(this[val]);
    });

    return Rx.Observable.create(observer => {
      const func = () => cassandra.client.execute(this.saveQ, arr1.concat(arr2), {prepare:true});

      func().then(entity => {
        observer.next();
        observer.complete();
      }).catch(err => observer.error(err));

      return function(){};
    }).subscribe(x => {}, err => console.log(err));
  }

  remove() {
    let arr = [];

    this.keyList.forEach(val => {
      arr.push(this[val]);
    });

    return Rx.Observable.create(observer => {
      const func = () => cassandra.client.execute(this.removeQ, arr, {prepare:true});

      func().then(entity => {
        observer.next();
        observer.complete();
      }).catch(err => observer.error(err));

      return function(){};
    }).subscribe(x => {}, err => console.log(err));    
  }
}