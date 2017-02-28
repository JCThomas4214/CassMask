'use strict';

import { cassandra, Schema } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

/*
      SELECTS FROM THE DATABASE WITH ONLY AN ID
        IF NO ID SET IN THE MODEL THIS SHOULD BE A UUID THAT HAS A SECONDARY INDEX
 */
export function findById(id: string): Schema {
  let obs = List<Rx.Observable<any>>(this.obs);
  let item: Entity = new Entity({ id : id }, this);

  if (item.preFindCb) {
    obs = this.checkTable(obs).push(Rx.Observable.create(observer => {
      item.preFindCb(() => {
        observer.next();
        observer.complete();
      }, err => observer.error(err));
    }));
  }

  obs = this.checkTable(obs).push(Rx.Observable.create(observer => {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ${id}`

    cassandra.client.execute(query).then(entity => {
      // all rows in the response will be stored in a Entity class inside items array
      const rows = entity.rows;
      let items;

      if (rows.length === 0) {
        observer.error({ message: 'No Entities were found', statusCode: 404 });
      } else if (rows.length > 1) {
        items = [];
        for (let z = 0; z < rows.length; z++) {
          items.push(new Entity(rows[z], this))
        }
      } else {
        items = new Entity(rows[0], this);
      }

      // If the find event hook was initialized
      if(item.postFindCb) { // if find Event hook set
        item.postFindCb(x => { // execute the find hook callback
          observer.next(x);
          observer.complete();
        }, err => observer.error(err), items);
      } else { // if no find hook set
        observer.next(items); // set next() argument to Entity array
        observer.complete();
      }
    }).catch(err => observer.error(err));

    return function () {};
  }));

  return new Schema(this, obs);
}