'use strict';

import { client, Model } from '../index';
import { Entity } from './entity';
import { objDiff } from './parseModel';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';


/*
    PARSES THE INPUTTED OBJECT
      THEN RETURNS AN OBSERVABLE QUERY 
 */
export function parseQuerySelect(item: Entity, options?: any): Rx.Observable<any> {

  return Rx.Observable.create(observer => {

    let sel: string; // column select holder

    if (options && options.attributes) { // if options and options.attributes exists
      const attr = options.attributes; // attr is a ref holder
      if (Array.isArray(attr)) // if attr is an array
        sel = attr.join(','); // join array into string
      else if (attr.exclude) { 
        sel = objDiff(this.schema.allCol, attr.exclude).join(','); // fidn set difference and join
      }
    } else sel = '*'; // else select all columns

    let query = `SELECT ${sel} FROM ${this.tableName} WHERE`; // start with a base query
    let params = []; // where params will be stored

    if (!item.isEmpty()) {
      // append to query string all columns and push values to params array
      for(let x in item.attributes) {
        query += ` ${x} = ? AND`;
        params.push(item[x]);
      }
      query = query.substring(0, query.length-4); // truncate last AND in the query string
    } else {
      query = `SELECT ${sel} FROM ${this.tableName}`;
    }
    if (options) {
      // if orderBy 
      if (options.orderBy) query += ` order by ${options.orderBy}`;
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
        observer.error({ message: 'No Entities were found', statusCode: 404 });
      } else if (rows.length > 1) {
        items = [];
        for (let z = 0; z < rows.length; z++) {
          items.push(new Entity(rows[z], this));
        }
      } else {
        items = new Entity(rows[0] || {}, this);
      }

      // If the find event hook was initialized
      if(this.helper.post.find) { // if find Event hook set
        this.helper.post.find(x => { // execute the find hook callback
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

export function find(object?: Object, options?: any): Model {
  let obs = List<Rx.Observable<any>>(this.obs);
  let item: Entity = new Entity(object || {}, this);

  if (item.prefind) {
    obs = obs.push(Rx.Observable.create(observer => {
      item.prefind(() => {
        observer.next();
        observer.complete();
      }, err => observer.error(err), item);
    }));
  }
  
  obs = obs.push(this.parseQuerySelect(item, options));

  return new Model(this, obs);
}