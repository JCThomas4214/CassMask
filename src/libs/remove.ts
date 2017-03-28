import { client, Model, SchemaOptions } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryDelete(item: Entity, options: SchemaOptions) {

  let params = [];

  let tmp = `DELETE FROM ${item.schemaHelper.tableName}`; // set starting query string
  if (options && options.using) tmp += ` USING ${options.using}`;
  tmp += ' WHERE';
  // for all keys in this item
  for(let y in item.attributes) {
    const val = item[y];
    tmp += ` ${y} = ? AND`; // append key to query string
    params.push(val); // push value to params array
  }
  let query = tmp.substring(0, tmp.length-4); // truncate last ' AND' on the string
  if (options && options.if) query += ` IF ${options.if}`

  return {
    query: query,
    params: params
  };
  
}

export function executeQueryDelete(item: Entity, options: SchemaOptions): Rx.Observable<any> {
  return Rx.Observable.create(observer => {

    const q = parseQueryDelete(item, options);

    return client.execute(q.query, q.params, {prepare:true}).then(response => { // entity will be useless information about the DB
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

  });
}