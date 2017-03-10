import { client, Model } from '../index';
import { Entity } from './entity';
import { objDiff } from './parseModel';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

/*
      SELECTS FROM THE DATABASE WITH ONLY AN ID
        IF NO ID SET IN THE MODEL THIS SHOULD BE A UUID THAT HAS A SECONDARY INDEX
 */
export function findById(id: string, options?: any): Model {
  let obs = List<Rx.Observable<any>>(this.obs);
  let item: Entity = new Entity({ id : id }, this);

  if (item['prefind']) {
    obs = obs.push(Rx.Observable.create(observer => {
      item['prefind'](() => {
        observer.next();
        observer.complete();
      }, err => observer.error(err), item);
    }));
  }

  obs = obs.push(Rx.Observable.create(observer => {
    let sel: string; // column select holder

    if (options && options.attributes) { // if options and options.attributes exists
      const attr = options.attributes; // attr is a ref holder
      if (Array.isArray(attr)) // if attr is an array
        sel = attr.join(','); // join array into string
      else if (attr.exclude) { 
        sel = objDiff(this.schema.allCol, attr.exclude).join(','); // fidn set difference and join
      }
    } else sel = '*'; // else select all columns

    const query = `SELECT ${sel} FROM ${this.schema.tableName} WHERE id = ${id}`

    client.execute(query).then(entity => {
      // all rows in the response will be stored in a Entity class inside items array
      const rows = entity.rows;
      let items;

      if (rows.length === 0) {
        observer.error({ message: 'No Entities were found', statusCode: 404 });
      } else if (rows.length > 1) {
        items = [];
        for (let z = 0; z < rows.length; z++) {
          items.push(new Entity(rows[z], this))
        }
      } else {
        items = new Entity(rows[0], this);
      }

      // If the find event hook was initialized
      if(item['postfind']) { // if find Event hook set
        item['postfind'](x => { // execute the find hook callback
          observer.next(x);
          observer.complete();
        }, err => observer.error(err), items);
      } else { // if no find hook set
        observer.next(items); // set next() argument to Entity array
        observer.complete();
      }
    }).catch(err => observer.error(err));

    return function () {};
  }));

  return new Model(this, obs);
}