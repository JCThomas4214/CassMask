import * as Rx from 'rxjs';
import { List } from 'immutable';
import cassandra from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryDelete(items: any) {
  let q = [];

  for(let x=0; x < items.length; x++) {
    q.push({ query: '', params: [] });

    let tmp = `DELETE FROM ${this.tableName} WHERE`;

    for(let y in items[x]) {
      tmp += ` ${y} = ? AND`;
      q[x].params.push(items[x][y]);
    }
    q[x].query = tmp.substring(0, tmp.length-4);

  }
  let batchable = this.batchable.concat(q);

  if (items.length === 0 || q[0].params.length === 0) {
    this.obs = this.checkTable().push(Rx.Observable.create(observer => {

      let func = () => {
        return cassandra.client.execute(`TRUNCATE ${this.tableName}`);
      };

      func().then(entity => {
        observer.next(entity);
        observer.complete();
      }).catch(err => observer.error(err));

      return function() {};
    }));

    batchable = List<any>([]);
  }

  // console.log(batchable.toArray());

  return {
    tblChked: this.tblChked,
    model: this.model,
    auto: this.auto,
    tableName: this.tableName,        
    obs: this.obs,
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

export function remove(object: any = {}) {      
    return Array.isArray(object) ? this.parseQueryDelete(object) : this.parseQueryDelete([object]);
}