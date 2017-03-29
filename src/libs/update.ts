import { client, Model, SchemaOptions, UpdateObject } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';

import { InvalidActionError } from './errors';

export function setVal(itemVal, columnVal, params): string {
  if (itemVal.type) {
    switch (itemVal.type) {
      case 'MAP':

        if (itemVal.action === 'append') {
          params.push(itemVal.payload);
          return ` ${columnVal} = ${columnVal} + ?,`;
        }
        else if (itemVal.action === 'remove') {
          params.push(itemVal.payload);
          return ` ${columnVal} = ${columnVal} - ?,`;
        }
        else if (itemVal.action === 'set') {
          params.push(itemVal.index);
          params.push(itemVal.payload);
          return ` ${columnVal}[?] = ?,`;
        }
        else {
          params.push(itemVal.payload);
          return ` ${columnVal} = ?,`;
        }

      case 'LIST':
        
        if (itemVal.action === 'append') {
          params.push(itemVal.payload);
          return ` ${columnVal} = ${columnVal} + ?,`;
        }
        else if (itemVal.action === 'prepend') {
          params.push(itemVal.payload);
          return ` ${columnVal} = ? + ${columnVal},`;
        }
        else if (itemVal.action === 'remove') {
          let err = {};
          err[columnVal] = {
            message: `'remove' action is for remove query only`,
            kind: 'user defined',
            path: columnVal,
            value: itemVal.payload,
            name: 'InvalidActionError'
          };
          Rx.Observable.throw(new InvalidActionError(err, 'LIST Remove is only usable in a remove query!!'));
        }
        else if (itemVal.action === 'set') {
          params.push(itemVal.index);
          params.push(itemVal.payload);
          return ` ${columnVal}[?] = ?,`;
        }
        else if (itemVal.action === 'reset') {
          params.push(itemVal.payload);
          return ` ${columnVal} = ?,`;
        }

      case 'SET':
        
        if (itemVal.action === 'append') {
          params.push(itemVal.payload);
          return ` ${columnVal} = ${columnVal} + ?,`;
        }
        else if (itemVal.action === 'remove') {
          let err = {};
          err[columnVal] = {
            message: `'remove' action is for remove query only`,
            kind: 'user defined',
            path: columnVal,
            value: itemVal.payload,
            name: 'InvalidActionError'
          };
          Rx.Observable.throw(new InvalidActionError(err, 'SET Remove is only usable in a remove query!!'));
        }
        else if (itemVal.action === 'set') {
          params.push(itemVal.index);
          params.push(itemVal.payload);
          return ` ${columnVal}[?] = ?,`;
        }
        else if (itemVal.action === 'reset') {
          params.push(itemVal.payload);
          return ` ${columnVal} = ?,`;
        }

    }
  }
  else {
    params.push(itemVal);
    return ` ${columnVal} = ?,`;
  }
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
      tmp += setVal(itemVal, columnVal, params); // append set attributes to query string
    }
  }
  tmp = tmp.substring(0, tmp.length-1) + ' WHERE'; // truncate the last ', ' from the query string
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