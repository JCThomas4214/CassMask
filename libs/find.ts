import { client, Model, FindOptions } from '../index';
import { Entity } from './entity';
import { objDiff, Error } from './schema';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

class NotFoundError extends Error {
  message: string = "Row not found";
  name: string = "NotFoundError";

  constructor(error: any, message: string) {
    super(error);
  }
}

/*
    PARSES THE INPUTTED OBJECT
      THEN RETURNS AN OBSERVABLE QUERY 
 */
export function parseQuerySelect(item: Entity, options?: FindOptions): Rx.Observable<any> {

  return Rx.Observable.create(observer => {

    let sel: string; // column select holder

    if (options && options.attributes) { // if options and options.attributes exists
      const attr = options.attributes; // attr is a ref holder
      if (Array.isArray(attr)) // if attr is an array
        sel = attr.join(','); // join array into string
      else if (attr.exclude) { 
        sel = objDiff(this.schemaHelper.allCol, attr.exclude).join(','); // fidn set difference and join
      }
    } else sel = '*'; // else select all columns

    let query = `SELECT ${sel} FROM ${this.schemaHelper.tableName} WHERE`; // start with a base query
    let params = []; // where params will be stored

    if (!item.isEmpty()) {
      // append to query string all columns and push values to params array
      for(let x in item.attributes) {
        query += ` ${x} = ? AND`;
        params.push(item[x]);
      }
      query = query.substring(0, query.length-4); // truncate last AND in the query string
    } else {
      query = `SELECT ${sel} FROM ${this.schemaHelper.tableName}`;
    }
    if (options) {
      // if groupBy 
      if (options.groupBy) query += ` GROUP BY ${options.groupBy}`;
      // if orderBy 
      if (options.orderBy) query += ` ORDER BY ${options.orderBy}`;
      // if options for limit 1
      if (options.perPartitionLimit) query += ` PRE PARTITION LIMIT ${options.perPartitionLimit}`;
      // if options for limit 1
      if (options.limit) query += ` LIMIT ${options.limit}`;
      // options for allow filtering
      if (options.allowFiltering && params.length > 0) query += ' ALLOW FILTERING';
    }

    client.execute(query, params, {prepare:true}).then(entity => {
      // all rows in the response will be stored in a Entity class inside items array
      const rows = entity.rows;
      let items;

      if (rows.length === 0) {
        let err = {
          message: `No Entities were found`,
          kind: 'library defined',
          name: 'NotFoundError'
        };
        observer.error(new NotFoundError(err, 'No Entities were found'));
      } else if (rows.length > 1) {
        items = [];
        for (let z = 0; z < rows.length; z++) {
          items.push(new Entity(rows[z], this));
        }
      } else {
        items = new Entity(rows[0] || {}, this);
      }

      // If the find event hook was initialized
      if(this.schema['post_find']) { // if find Event hook set
        this.schema['post_find'](x => { // execute the find hook callback
          observer.next(x);
          observer.complete();
        }, err => observer.error(err), items);
      } else { // if no find hook set
        observer.next(items); // set next() argument to Entity array
        observer.complete();
      }
    }).catch(err => observer.error(err));

    return function () {};
  });

}


/*
      PARSES ATTR INTO FINDS OBJECT TO THEN QUERY THE DB
 */

export function find(object?: Object, options?: FindOptions): Model {
  let obs = List<Rx.Observable<any>>(this.obs);
  let item: Entity = new Entity(object || {}, this);

  if (item['pre_find']) {
    obs = obs.push(Rx.Observable.create(observer => {
      item['pre_find'](() => {
        observer.next();
        observer.complete();
      }, err => observer.error(err), item);
    }));
  }
  
  obs = obs.push(this.parseQuerySelect(item, options));

  return new Model(this, obs);
}