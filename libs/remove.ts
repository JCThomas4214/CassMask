'use strict';

import { cassandra, Schema } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';


/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryDelete(item: Entity, options: any): Rx.Observable<any> {

  return Rx.Observable.create(observer => {
      let params = [];

      let tmp = `DELETE FROM ${this.tableName} WHERE`; // set starting query string
      // for all keys in this item
      for(let y in item.attributes) {
        const val = item[y];            
        tmp += ` ${y} = ? AND`; // append key to query string
        params.push(val); // push value to params array          
      }
      const query = tmp.substring(0, tmp.length-4); // truncate last ' AND' on the string

      cassandra.client.execute(query, params, {prepare:true}).then(response => { // entity will be useless information about the DB
        if(item.postRemoveCb) { // if remvoe event hook was set
          item.postRemoveCb(x => { // execute remove hook callback
            observer.next(x);
            observer.complete();
          }, err => observer.error(err), item);
        } else { // if remvoe hook was not set
          observer.next(item); // set next() argument to new Entity aligned with items iteration
          observer.complete();
        }
      }).catch(err => observer.error(err));

      return function(){};
  });

}

/*
    USES THE PARED OBJECT FROM FIND() OR FINDONE() 
    AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
    EXECUTE FUNCTION

    REMOVE() IS FOR DELETING FOUND ROWS OR TRUNCATING TABLE
 */

export function remove(items?: any, options?: Object): Schema { 
  let obs: any = List<Rx.Observable<any>>(this.obs);

  if (items) { // if items passed into function
    if (!Array.isArray(items)) items = [items];

    let preArr = []; // array to hold the preHook Observables
    let parseArr = []; // array to hold Query Observables
    // iterate through all items in the items array
    for (let x = 0; x < items.length; x++) {
      let item = new Entity(items[x], this);

      if (item.preRemoveCb) {
        preArr.push(Rx.Observable.create(observer => {
          item.preRemoveCb(item, () => {
            observer.next();
            observer.complete();
          }, err => observer.error(err));
        }));
      }

      parseArr.push(this.parseQueryDelete(item, options));
    }

    if (this.helper.preRemoveCb) {
      let pre = preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0];
      obs = obs.push(pre);
    }

    obs = obs.concat(parseArr);

  } else { // if no items sent to the remove function

    obs = obs.push(Rx.Observable.create(observer => {
      cassandra.client.execute(`TRUNCATE ${this.tableName}`).then(entity => { // entity will be useless information about DB
        observer.next(); // no argument set for next()
        observer.complete();
      }).catch(err => observer.error(err));

      return function() {};
    }));

  }

  return new Schema(this, obs);
}