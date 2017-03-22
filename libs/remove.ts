import { client, Model, SchemaOptions } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryDelete(item: Entity, options: SchemaOptions): Rx.Observable<any> {

  return Rx.Observable.create(observer => {
      let params = [];

      let tmp = `DELETE FROM ${this.schemaHelper.tableName}`; // set starting query string
      if (options && options.using) tmp += ` USING ${options.using}`;
      tmp += ' WHERE';
      // for all keys in this item
      for(let y in item.attributes) {
        const val = item[y];
        tmp += ` ${y} = ? AND`; // append key to query string
        params.push(val); // push value to params array          
      }
      let query = tmp.substring(0, tmp.length-4); // truncate last ' AND' on the string
      if (options && options.if) query += ` IF ${options.if}`;

      client.execute(query, params, {prepare:true}).then(response => { // entity will be useless information about the DB
        if(item['post_remove']) { // if remvoe event hook was set
          item['post_remove'](x => { // execute remove hook callback
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

export function remove(items?: any, options?: SchemaOptions): Model { 
  let obs: Rx.Observable<any> = Rx.Observable.concat(this.obs);

  if (items) { // if items passed into function
    if (!Array.isArray(items)) items = [items];

    let preArr = []; // array to hold the preHook Observables
    let parseArr = []; // array to hold Query Observables
    // iterate through all items in the items array
    for (let x = 0; x < items.length; x++) {
      let item = new Entity(items[x], this);

      if (item['pre_remove']) {
        preArr.push(Rx.Observable.create(observer => {
          item['pre_remove'](() => {
            observer.next();
            observer.complete();
          }, err => observer.error(err), item);
        }));
      }

      parseArr.push(this.parseQueryDelete(item, options));
    }

    if (this.schema['pre_remove']) {
      let pre = preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0];
      obs = obs.concat(pre);
    }

    obs = obs.concat(...parseArr);

  } else { // if no items sent to the remove function

    obs = obs.concat(Rx.Observable.create(observer => {
      client.execute(`TRUNCATE ${this.schemaHelper.tableName}`).then(entity => { // entity will be useless information about DB
        observer.next(); // no argument set for next()
        observer.complete();
      }).catch(err => observer.error(err));

      return function() {};
    }));

  }

  return new Model(this, obs);
}