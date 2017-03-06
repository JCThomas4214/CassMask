'use strict';

import { cassandra, Schema } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';


/*
      CHANGES THE FIND1 VARIABLE TO TRUE
        THIS WILL CAUSE EXEC TO LIMIT THE QUERY TO 1
 */

export function findOne(object?: Object, options?: any): Schema {
  let obs = List<Rx.Observable<any>>(this.obs);
  let item: Entity = new Entity(object || {}, this);

  if (!options) options = {};
  options.limitOne = true; // Make sure we limit the response to one row

  if (this.helper.preFindCb) {
    obs = obs.push(Rx.Observable.create(observer => {
      item.preFindCb(() => {
        observer.next();
        observer.complete();
      }, err => observer.error(err));
    }));
  }
  
  obs = obs.push(this.parseQuerySelect(item, options));

  return new Schema(this, obs);
}