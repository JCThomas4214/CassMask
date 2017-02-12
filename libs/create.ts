import * as Rx from 'rxjs';
import { List, Map } from 'immutable';
import { cassandra, Entity } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryInsert(items: any, options: any, state: Map<any,any>) {
  let q = []; // initialize q array to hold batched queries
  // for all objects in items array
  // if an object was passed into create() items will be an aray with that object
  for(let x=0; x < items.length; x++) {
    const item = items[x]; // hold onto current items object iteration for faster reads
    q.push({ query: '', params: [] }); // push new batch syntax object into q array
    // INSERT is a more complicated query that requies more feness
    // // separate query into two parts, columns & values
    let tmp1 = `INSERT INTO ${this.state.get('tableName')} (`; // columns will be appended to this
    let tmp2 = `) VALUES (`; // values appended to this
    // for all keys in the current object
    for(let y in item) {
        const val = item[y]; // hold onto key's value for faster reads
        tmp1 += `${y}, `; // append iteration's key to columns string
        // check to make sure that value is not a DB function
        // if value is DB function
        if (val === 'now()' || 
          val === 'uuid()' || 
          val === 'toTimeStamp(now())') {

          tmp2 += `${val}, `; // function must be appended to values string

        } else { // if not a DB function

          tmp2 += '?, '; // appends '?' as necessary for prepared queries
          q[x].params.push(val); // push value into q's params array

        }

    }
    tmp1 = tmp1.substring(0, tmp1.length-2); // truncate the last ', ' in the columns string
    tmp2 = tmp2.substring(0, tmp2.length-2) + ')'; // truncate last ', ' in values string

    q[x].query = tmp1 + tmp2; // q's query string set to concat of columns and values string

    /*
        create() has the option to batch but will be false by default
          if batch is false
     */
    if (!options.batch) {
      state = this.checkTable(state).update('obs', obs => obs.push(Rx.Observable.create(observer => {
        // create function to execute current query and params iteration
        const func = () => cassandra.client.execute(q[x].query, q[x].params, {prepare:true});
        // execute function when subscribe() and wait for promise
        func().then(entity => { // entity will be useless from DB
          if(state.getIn(['events','saveHook'])) { // if save Event hook set
            state.getIn(['events','saveCb'])(new Entity(item, state), x => { // execute the save hook callback
              observer.next(x);
              observer.complete();
            }, cassandra.client);
          } else { // if no save hook set
            observer.next(new Entity(item, state)); // set next() argument to new Entity
            observer.complete();
          }
        }).catch(err => observer.error(err));

        return function(){};
      })));
    } 

  }
  // After for loop: if batch is true
  if (options.batch) { // create new observable to be pushed into parent state observable List
    state = this.checkTable(state).update('obs', obs => obs.push(Rx.Observable.create(observer => {
      // create function to execute a batch query with q array and any batchable objects in the parent state
      const func = () => cassandra.client.batch(state.get('batchable').concat(q).toArray(), {prepare:true});
      // execute function on subscribe() and wait for promise
      func().then(entity => { // entity will be useless information about the DB
        let tmp = []; // create array to hold Entity objects
        items.forEach(val => { // forEach item in the items array
          tmp.push(new Entity(val, state)); // create equivilant Entity object to push into array
        });

        if(state.getIn(['events','saveHook'])) { // if save Event hook set
          state.getIn(['events','saveCb'])(tmp, x => { // execute save hook callback
            observer.next(x);
            observer.complete();
          }, cassandra.client);
        } else { // if no save hook set
          observer.next(tmp); // next() argument set to Entity array
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
      CREATE A NEW ROW IN THE INSTANCE TABLE
        USES CASS DRIVER BATCH FUNCTION TO INSERT PARSED OBJECT ARRAY
 */

export function create(items: any, options: Object = {}, state?: Map<any,any>) {  
  const st = state ? state : this.state.concat({});

  return Array.isArray(items) ? this.parseQueryInsert(items, options, st) : this.parseQueryInsert([items], options, st);
}