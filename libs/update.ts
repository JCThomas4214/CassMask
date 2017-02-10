import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryUpdate(items: any, options: any) {
  let q = [];
  let obs = this.obs.concat([]);

  for(let x=0; x < items.length; x++) {
    q.push({ query: '', params: [] });

    let tmp = `UPDATE ${this.tableName} SET`;

    for(let y in items[x].set) {
      tmp += ` ${y} = ?, `;
      q[x].params.push(items[x].set[y]);
    }
    tmp = tmp.substring(0, tmp.length-2);
    tmp += ' WHERE';

    for(let z in items[x].in) {
      tmp += ` ${z} = ? AND`;
      q[x].params.push(items[x].in[z]);
    }
    
    tmp = tmp.substring(0, tmp.length-4);
    tmp += ' IF EXISTS';

    q[x].query = tmp;

    if (!options.batch) {
      obs = this.checkTable(obs).push(Rx.Observable.create(observer => {

        const func = () => cassandra.client.execute(q[x].query, q[x].params, {prepare:true});

        func().then(entity => {
          observer.next(entity);
          observer.complete();
        }).catch(err => observer.error(err));

        return function(){};
      }));
    } 

  }

  if (options.batch) {
    obs = this.checkTable(obs).push(Rx.Observable.create(observer => {

      const func = () => cassandra.client.batch(this.batchable.concat(q).toArray(), {prepare:true});

      func().then(entity => {
        observer.next(entity);
        observer.complete();
      }).catch(err => observer.error(err));

      return function(){};
    }));
  } 

  // console.log(obs.toArray());

  return {
    tblChked: this.tblChked,
    model: this.model,
    tableName: this.tableName,        
    obs: obs,
    batchable: this.batchable,
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

export function update(object: any, options: Object = {}) {
  return Array.isArray(object) ? this.parseQueryUpdate(object, options) : this.parseQueryUpdate([object], options);
}