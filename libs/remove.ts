import * as Rx from 'rxjs';
import { List } from 'immutable';
import { cassandra } from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryDelete(items: any, options: any) {
  let q = [];
  let obs = this.obs.concat([]);

  for(let x=0; x < items.length; x++) {
    q.push({ query: '', params: [] });

    let tmp = `DELETE FROM ${this.tableName} WHERE`;

    for(let y in items[x]) {
      tmp += ` ${y} = ? AND`;
      q[x].params.push(items[x][y]);
    }
    q[x].query = tmp.substring(0, tmp.length-4);

    if (!options.batch && q[0].params.length > 0) {
      obs = this.checkTable(obs).push(Rx.Observable.create(observer => {

        const func = () => cassandra.client.execute(q[x].query, q[x].params, {prepare:true});

        func().then(entity => {
          if(this.removeHook) {
            this.removeCb(observer, entity, cassandra.client);
          } else {
            observer.next(entity);
            observer.complete();
          }
        }).catch(err => observer.error(err));

        return function(){};
      }));
    } 

  }
  let batchable = this.batchable.concat(q);

  if (q[0].params.length === 0) {
    obs = this.checkTable(obs).push(Rx.Observable.create(observer => {

      let func = () => cassandra.client.execute(`TRUNCATE ${this.tableName}`);

      func().then(entity => {
        observer.next(entity);
        observer.complete();
      }).catch(err => observer.error(err));

      return function() {};
    }));

    batchable = List<any>([]);
  } else if (options.batch) {
    obs = this.checkTable(obs).push(Rx.Observable.create(observer => {

      const func = () => cassandra.client.batch(this.batchable.concat(q).toArray(), {prepare:true});

      func().then(entity => {
        if(this.removeHook) {
          this.removeCb(observer, entity, cassandra.client);
        } else {
          observer.next(entity);
          observer.complete();
        }
      }).catch(err => observer.error(err));

      return function(){};
    }));
  }

  // console.log(obs.toArray());

  return {
    createHook: this.createHook,
    updateHook: this.updateHook,
    removeHook: this.removeHook,
    findHook: this.findHook,
    createCb: this.createCb,
    updateCb: this.updateCb,
    removeCb: this.removeCb,
    findCb: this.findCb, 

    tblChked: this.tblChked,
    model: this.model,
    tableName: this.tableName,        
    obs: obs,
    batchable: batchable,
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

    checkTable: this.checkTable
  };
}

/*
    USES THE PARED OBJECT FROM FIND() OR FINDONE() 
    AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
    EXECUTE FUNCTION

    REMOVE() IS FOR DELETING FOUND ROWS OR TRUNCATING TABLE
 */

export function remove(object: any = {}, options: Object = {}) {      
    return Array.isArray(object) ? this.parseQueryDelete(object, options) : this.parseQueryDelete([object], options);
}