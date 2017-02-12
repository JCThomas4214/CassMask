import * as Rx from 'rxjs';
import *  as _ from 'lodash';
import { List, Map } from 'immutable';
import { cassandra, Entity } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryUpdate(items: any, options: any, state: Map<any,any>) {
  // Array to hold query strings
  let q = [];
  // Array to hold the merged in and set objects
  // These objects will be used to create new Entity objects for the observer next() argument 
  let entities = [];

  // for all objects in the itmes array
  // if only an object was passed into update() it will be an array with one object
  for(let x=0; x < items.length; x++) {
    // hold the object at this index
    const item = items[x];
    // create new object and push into q to hold soon to be query string and params
    q.push({ query: '', params: [] });
    let entity = {}; // create hoder object to merge set and in at this index
    // start query string at this base
    let tmp = `UPDATE ${state.get('tableName')} SET`; 
    // for all keys in the set object
    for(let y in item.set) {
      tmp += ` ${y} = ?, `; // append set attributes to query string
      q[x].params.push(item.set[y]); // push values to params array
      entity[y] = item.set[y]; // and set entity key value to match
    }
    tmp = tmp.substring(0, tmp.length-2); // truncate the last ', ' from the query string
    tmp += ' WHERE'; // append WHERE to continue the query string with keys in 'in' object
    // for all keys in the 'in' object
    for(let z in item.in) {
      tmp += ` ${z} = ? AND`; // append all 'in' keys to query string
      q[x].params.push(item.in[z]); // push key values to params array
      entity[z] = item.in[z]; // append key values to entity to match
    }
    tmp = tmp.substring(0, tmp.length-4); // truncate last ' AND' from the query string
    tmp += ' IF EXISTS'; // append IF EXIST to query string. UPDATE query might create new row without this

    q[x].query = tmp; // set the query key in q array to new query string
    entities.push(entity); // push entity to entities array for later

    /*
        update() can batch if the option is set but by default it will not
          this means that for every object in the array a new observable 
          query will be created for the final subscribe()
     */
    if (!options.batch) {
      // Always check in table has been checked for creation
      // if tblChked boolean === true will return current state with no appended create table query
      state = this.checkTable(state).update('obs', obs => obs.push(Rx.Observable.create(observer => {
        // function to execute the current query in the query array
        const func = () => cassandra.client.execute(q[x].query, q[x].params, {prepare:true});
        // execute query
        func().then(entity => { // if the event hook was set
          if(state.getIn(['events','saveHook'])) { // in state.events.saveHook will indicator boolean
            // execute the hook callback and create newEntity object with current entity JSON
            state.getIn(['events','saveCb'])(new Entity(entity, state), x => {
              observer.next(x);
              observer.complete();
            }, cassandra.client);
          } else { // if no hook was set
            observer.next(new Entity(entity, state)); // next() arg is new Entity object
            observer.complete(); // now complete
          }
        }).catch(err => observer.error(err));

        return function(){};
      })));
    } 

  }

  // If the batch object is set create a batch query from the query array
  if (options.batch) {
    // batch query is only one query
    state = this.checkTable(state).update('obs', obs => obs.push(Rx.Observable.create(observer => {

      const func = () => cassandra.client.batch(state.get('batchable').concat(q).toArray(), {prepare:true});

      func().then(entity => {
        // create an array of new Entity objects to set as the observer argument
        let tmp = [];
        entities.forEach(val => {
          tmp.push(new Entity(val, state));
        });

        if(state.getIn(['events','saveHook'])) {
          state.getIn(['events','saveCb'])(tmp, x => {
            observer.next(x);
            observer.complete();
          }, cassandra.client);
        } else {
          observer.next(tmp);
          observer.complete();
        }
      }).catch(err => observer.error(err));

      return function(){};
    })));
  } 

  // console.log(obs.toArray());

  return {
    state: state,
    
    createBatchQuery: this.createBatchQuery,
    parseQueryInsert: this.parseQueryInsert,
    parseQueryUpdate: this.parseQueryUpdate,
    parseQueryDelete: this.parseQueryDelete,

    seam: this.seam,
    remove: this.remove,
    create: this.create,
    find: this.find,
    findOne: this.findOne,
    update: this.update,

    checkTable: this.checkTable,
    createTable: this.createTable
  };
}

/*
    USES THE PARSED OBJECT FROM FIND() OR FINDONE() 
    AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
    EXECUTE FUNCTION

    UPDATE() IS USED FOR UPDATING EXISTING ROW(S)
    IN THE TABLE
 */

export function update(object: any, options: Object = {}, state?: Map<any,any>) {
  const st = state ? state : this.state.concat({});

  return Array.isArray(object) ? this.parseQueryUpdate(object, options, st) : this.parseQueryUpdate([object], options, st);
}