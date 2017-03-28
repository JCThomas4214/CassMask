import { client, Model, SchemaOptions } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */
export function parseQueryInsert(item: Entity, options: SchemaOptions) {

  let params = [];
  // INSERT is a more complicated query that requires more feness
  // // separate query into two parts, columns & values
  let tmp1 = `INSERT INTO ${item.schemaHelper.tableName} (`; // columns will be appended to this
  let tmp2 = `) VALUES (`; // values appended to this
  // for all keys in the current object
  for(let y in item.attributes) {
      const val = item[y]; // hold onto key's value for faster reads
      // check to make sure that value is not a DB function
      // if value is DB function
      if (val === 'now()' || val === 'uuid()' || val === 'toTimeStamp(now())') {
        tmp1 += `${y}, `; // append iteration's key to columns string
        tmp2 += `${val}, `; // function must be appended to values string
      } else { // if not a DB function
        tmp1 += `${y}, `; // append iteration's key to columns string
        tmp2 += '?, '; // appends '?' as necessary for prepared queries
        params.push(val); // push value into q's params array
      }
  }

  let query = tmp1.substring(0, tmp1.length-2) + tmp2.substring(0, tmp2.length-2) + ')'; // q's query string set to concat of columns and values string
  if (options) {
    if (options.if) query += ` IF ${options.if}`;
    if (options.using) query += ` USING ${options.using}`;
  }

  return {
    query: query,
    params: params
  };
}

export function executeQueryInsert(item: Entity, options: SchemaOptions): Rx.Observable<any> {
  return Rx.Observable.create(observer => {

    const q = parseQueryInsert(item, options);
    
    return client.execute(q.query, q.params, {prepare:true}).then(response => { // entity will be useless from DB
      if(item['post_create']) { // if save Event hook set
        item['post_create'](x => { // execute the save hook callback
          observer.next(x);
          observer.complete();
        }, err => observer.error(err), item);
      } else { // if no save hook set
        observer.next(item); // set next() argument to new Entity
        observer.complete();
      }
    }).catch(err => observer.error(err));
  
  });
}