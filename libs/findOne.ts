import { Model } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';


/*
      CHANGES THE FIND1 VARIABLE TO TRUE
        THIS WILL CAUSE EXEC TO LIMIT THE QUERY TO 1
 */

export function findOne(object?: Object, options?: any): Model {
  let obs = List<Rx.Observable<any>>(this.obs);
  let item: Entity = new Entity(object || {}, this);

  if (!options) options = {};
  options.limit = 1; // Make sure we limit the response to one row

  if (item['prefind']) {
    obs = obs.push(Rx.Observable.create(observer => {
      item['prefind'](() => {
        observer.next();
        observer.complete();
      }, err => observer.error(err), item);
    }));
  }
  
  obs = obs.push(this.parseQuerySelect(item, options));

  return new Model(this, obs);
}