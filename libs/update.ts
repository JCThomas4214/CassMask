import { client, Model, SchemaOptions, UpdateObject } from '../index';
import { Entity } from './entity';
import * as Rx from 'rxjs';
import { List, Map } from 'immutable';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */
export function parseQueryUpdate(item: Entity, options: SchemaOptions): Rx.Observable<any> {

  return Rx.Observable.create(observer => {
      const keyList = this.schemaHelper.keyList;
      const columnList = this.schemaHelper.columnList;

      let params = [];
      // start query string at this base
      let tmp = `UPDATE ${this.schemaHelper.tableName}`;
      if(options && options.using) tmp += ` USING ${options.using}`;
      tmp += ' SET';

      // for all keys in the set object
      for(let y = 0; y < columnList.length; y++) {
        const columnVal = columnList[y];
        const itemVal = item.attributes[columnVal];
        if (itemVal) {
          tmp += ` ${columnVal} = ?, `; // append set attributes to query string
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

      client.execute(query, params, {prepare:true}).then(entity => { // if the event hook was set
        if(item['post_update']) { // in state.events.saveHook will indicator boolean
          // execute the hook callback and create newEntity object with current entity JSON
          item['post_update'](x => {
            observer.next(x);
            observer.complete();
          }, err => observer.error(err), item);
        } else { // if no hook was set
          observer.next(new Entity(item, this)); // next() arg is new Entity object
          observer.complete(); // now complete
        }
      }).catch(err => observer.error(err));

      return function(){};
  });

}


/*
    USES THE PARSED OBJECT FROM FIND() OR FINDONE()
    AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
    EXECUTE FUNCTION

    UPDATE() IS USED FOR UPDATING EXISTING ROW(S)
    IN THE TABLE
 */

export function update(items: UpdateObject | Array<UpdateObject>, options?: SchemaOptions): Model {
  let obs: any = List<Rx.Observable<any>>(this.obs); // create new state object
  items = Array.isArray(items) ? items : [items]; // if items is not an array, make it one

  let validationArr = [];
  let preArr = []; // array to hold the preHook Observables
  let parseArr = []; // array to hold Query Observables
  // iterate through all items in the items array
  for (let x = 0; x < items.length; x++) {
    const object = items[x];
    let item = new Entity(object.set, this, {validateChk: true});
    item.merge(object.where);

    if (item['validationObs'])
      validationArr.push(item['validationObs']);

    if (item['pre_update']) {
      preArr.push(Rx.Observable.create(observer => {
        item['pre_update'](() => {
          observer.next();
          observer.complete();
        }, err => observer.error(err), item);
      }));
    }

    parseArr.push(this.parseQueryUpdate(item, options || {}));
  }

  if(validationArr.length > 0)
    obs = obs.push(validationArr.length > 1 ? Rx.Observable.merge.apply(this, validationArr) : validationArr[0]);
  if (this.schema['pre_update'])
    obs = obs.push(preArr.length > 1 ? Rx.Observable.merge.apply(this, preArr) : preArr[0]);

  obs = obs.concat(parseArr);

  return new Model(this, obs);
}
