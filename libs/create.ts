import { client, Model } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */
export function parseQueryInsert(item: Entity, options: any): Rx.Observable<any> {

  return Rx.Observable.create(observer => {
    let params = [];
    // INSERT is a more complicated query that requires more feness
    // // separate query into two parts, columns & values
    let tmp1 = `INSERT INTO ${this.schema.tableName} (`; // columns will be appended to this
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

    const query = tmp1.substring(0, tmp1.length-2) + tmp2.substring(0, tmp2.length-2) + ')'; // q's query string set to concat of columns and values string

    client.execute(query, params, {prepare:true}).then(response => { // entity will be useless from DB
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

    return function(){};

  });

}

/*
      CREATE A NEW ROW IN THE INSTANCE TABLE
        USES CASS DRIVER BATCH FUNCTION TO INSERT PARSED OBJECT ARRAY
 */

export function create(items: any, options?: Object): Model { 
  let obs: any = List<Rx.Observable<any>>(this.obs);
  items = Array.isArray(items) ? items : [items];

  let preArr = [];
  let parseArr = [];

  // create a read only pointer to a new object from the defaults Map
  const defaults = this.schema.defaults;
  // merge default values with each item in the items array
  for(let x = 0; x < items.length; x++) {
    let item = items[x];
    // Any value that has a default but is not indicated in the item will be default
    for(let y in defaults) { // go through all items in object
      if (!item[y]) item[y] = defaults[y]; // if a default property does not exist, make it
    }
    item = new Entity(item, this);

    if (item['pre_create']) {
      preArr.push(Rx.Observable.create(observer => {
        item['pre_create'](() => {
          observer.next();
          observer.complete();
        }, err => observer.error(err), item);
      }));
    }

    parseArr.push(this.parseQueryInsert(item, options));
  }

  if (this.schema['pre_create']) {
    obs = obs.push(preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0]);
  }

  obs = obs.concat(parseArr);

  return new Model(this, obs);
}