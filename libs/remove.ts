import * as Rx from 'rxjs';
import { List, Map } from 'immutable';
import { cassandra, Entity } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryDelete(items: any, options: any, state: Map<any,any>) {
  let q = []; // array to hold query objects for potential batching
  // for all JSON in the items array
  // If only a single object passed into remove() itmes will be an array with one object
  for(let x=0; x < items.length; x++) {
    const item = items[x]; // hold items index object for quicker reads
    q.push({ query: '', params: [] }); // prepare a new query batch object

    let tmp = `DELETE FROM ${state.get('tableName')} WHERE`; // set starting query string
    // for all keys in this item
    for(let y in item) {
      tmp += ` ${y} = ? AND`; // append key to query string
      q[x].params.push(item[y]); // push value to params array
    }
    q[x].query = tmp.substring(0, tmp.length-4); // truncate last ' AND' on the string

    /*
      remove() is able to batch but will be default false
        if batch is false and params array is not empty create query for each object in items array
        It's important to understand this will not happen if the items argument is undefined or empty
     */
    if (!options.batch && q[0].params.length > 0) {
      state = this.checkTable(state).update('obs', obs => obs.push(Rx.Observable.create(observer => {
        // create function to remove a single row from the table
        // this is aligned with the current iteration of the items array
        const func = () => cassandra.client.execute(q[x].query, q[x].params, {prepare:true});
        // execute function and wait for promise
        func().then(entity => { // entity will be useless information about the DB
          if(state.getIn(['events','removeHook'])) { // if remvoe event hook was set
            state.getIn(['events','removeCb'])(new Entity(item, state), x => { // execute remove hook callback
              observer.next(x);
              observer.complete();
            }, cassandra.client);
          } else { // if remvoe hook was not set
            observer.next(new Entity(item, state)); // set next() argument to new Entity aligned with items iteration
            observer.complete();
          }
        }).catch(err => observer.error(err));

        return function(){};
      })));
    } 

  }
  // After for loop: if the fir index' params array is empty then all will be empty
  // if empty items argument was either empty or undefined and table will be TRUNCATED
  if (q[0].params.length === 0) {
    state = this.checkTable(state)
      .update('obs', obs => obs.push(Rx.Observable.create(observer => {
        // create function to TRUNCATE the schema table
        const func = () => cassandra.client.execute(`TRUNCATE ${state.get('tableName')}`);
        // execute function and wait for promise
        func().then(entity => { // entity will be useless information about DB
          observer.next(); // no argument set for next()
          observer.complete();
        }).catch(err => observer.error(err));

        return function() {};
      })))
      .update('batchable', batchable => List<any>([]));
      
  } else if (options.batch) { // if batching was not false and the initial params array is not empty
    // the only other options is if the batch option is true
    state = this.checkTable(state).update('obs', obs => obs.push(Rx.Observable.create(observer => {
      // create function to execute batch query with all query objects in q array
      // append q array to any other batching objects in the parent state
      const func = () => cassandra.client.batch(state.get('batchable').concat(q).toArray(), {prepare:true});
      // execute function and wait for promise
      func().then(entity => { // entity will be unimportant information about the DB
        let tmp = []; // create new tmp array to hold new Entity objects
        items.forEach(val => { // forEach object in items create an equivilant Entity
          tmp.push(new Entity(val, state)); // push new Entity into tmp
        });
        // if remove Event hook was set
        if(state.getIn(['events','removeHook'])) {
          state.getIn(['events','removeCb'])(tmp, x => { // execute removeEvent callback
            observer.next(x);
            observer.complete();
          }, cassandra.client);
        } else { // if remove hook was not set
          observer.next(tmp); // set next argument to batched Entity items
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
    USES THE PARED OBJECT FROM FIND() OR FINDONE() 
    AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
    EXECUTE FUNCTION

    REMOVE() IS FOR DELETING FOUND ROWS OR TRUNCATING TABLE
 */

export function remove(object: any = {}, options: Object = {}, state?: Map<any,any>) { 
    const st = state ? state : this.state.concat({});

    return Array.isArray(object) ? this.parseQueryDelete(object, options, st) : this.parseQueryDelete([object], options, st);
}