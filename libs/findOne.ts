import { Model, FindOptions } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';


/*
      CHANGES THE FIND1 VARIABLE TO TRUE
        THIS WILL CAUSE EXEC TO LIMIT THE QUERY TO 1
 */

export function findOne(object?: Object, options?: FindOptions): Model {
  let obs: Rx.Observable<any> = Rx.Observable.concat(this.obs);
  let item: Entity = new Entity(object || {}, this);

  if (!options) options = {};
  options.limit = 1; // Make sure we limit the response to one row

  if (item['pre_find']) {
    obs = obs.concat(Rx.Observable.create(observer => {
      item['pre_find'](() => {
        observer.next();
        observer.complete();
      }, err => observer.error(err), item);
    }));
  }
  
  obs = obs.concat(this.parseQuerySelect(item, options));

  return new Model(this, obs);
}