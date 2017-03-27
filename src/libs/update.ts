import { client, Model, SchemaOptions, UpdateObject,
  MapAction, ListAction, SetAction } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';

export function isCollection(itemVal, columnVal): string {
  // if (itemVal instanceof MapAction) {
  //   // switch (itemVal.action) {
  //   //   case: 
  //   // }
  // }
  // else if (itemVal instanceof ListAction) {

  // } 
  // else if (itemVal instanceof SetAction) {

  // } 
  // else {
    return ` ${columnVal} = ?, `;
  // }
}

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */
export function parseQueryUpdate(item: Entity, options: SchemaOptions) {

  const keyList = item.schemaHelper.keyList;
  const columnList = item.schemaHelper.columnList;

  let params = [];
  // start query string at this base
  let tmp = `UPDATE ${item.schemaHelper.tableName}`;
  if(options && options.using) tmp += ` USING ${options.using}`;
  tmp += ' SET';

  // for all keys in the set object
  for(let y = 0; y < columnList.length; y++) {
    const columnVal = columnList[y];
    const itemVal = item.attributes[columnVal];
    if (itemVal) {
      tmp += isCollection(itemVal, columnVal); // append set attributes to query string
      params.push(itemVal); // push values to params array
    }
  }
  tmp = tmp.substring(0, tmp.length-2) + ' WHERE'; // truncate the last ', ' from the query string
  // append WHERE to continue the query string with keys in 'in' object
  // for all keys in the 'in' object
  for(let z = 0; z < keyList.length; z++) {
    const keyVal = keyList[z];
    const itemVal = item.attributes[keyVal];
    if (itemVal) {
      tmp += ` ${keyVal} = ? AND`; // append all 'in' keys to query string
      params.push(itemVal); // push key values to params array
    }
  }

  let query = tmp.substring(0, tmp.length-4); // set the query key in q array to new query string
  if (options && options.if) query += ` IF ${options.if}`;
  else query += ' IF EXISTS';

  return {
    query: query,
    params: params
  };
}

export function executeQueryUpdate(item: Entity, options: SchemaOptions): Rx.Observable<any> {
  return Rx.Observable.create(observer => {

      const q = parseQueryUpdate(item, options);

      return client.execute(q.query, q.params, {prepare:true}).then(entity => { // if the event hook was set
        if(item['post_update']) { // in state.events.saveHook will indicator boolean
          // execute the hook callback and create newEntity object with current entity JSON
          item['post_update'](x => {
            observer.next(x);
            observer.complete();
          }, err => observer.error(err), item);
        } else { // if no hook was set
          observer.next(new Entity(item, item.model)); // next() arg is new Entity object
          observer.complete(); // now complete
        }
      }).catch(err => observer.error(err));
  });
}