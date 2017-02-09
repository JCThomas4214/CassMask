import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
    CREATES A QUERY FROM THE CURRENT BATCHABLE LIST
      AND RETURNS TH NEW CONCATONATED OBSERVABLE LIST
 */

export function createBatchQuery(obs: List<Rx.Observable<any>>) {

  switch (this.batchable.size) {
    case 0:
      return this.checkTable(obs);
    case 1:
      return this.checkTable(obs).push(Rx.Observable.create((observer) => {

        let func = () => {
          return cassandra.client.execute(this.batchable.get(0).query, this.batchable.get(0).params, {prepare:true});
        };

        func().then(entity => {
          observer.next(entity);
          observer.complete();
        }).catch(err => observer.error(err))

        return function() {};
      }));
    default:
      return this.checkTable(obs).push(Rx.Observable.create((observer) => {

        let func = () => {
          return cassandra.client.batch(this.batchable.toArray(), {prepare:true});
        };

        func().then(entity => {
          observer.next(entity);
          observer.complete();
        }).catch(err => observer.error(err))

        return function() {};
      }));
  }

}