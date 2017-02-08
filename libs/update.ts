import * as Rx from 'rxjs';
import { List } from 'immutable';
import cassandra from '../index';

/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */

export function parseQueryUpdate(items: any) {
  let q = [];

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
  }

  // console.log(this.batchable.concat(q).toArray());

  return {
    tblChked: this.tblChked,
    model: this.model,
    auto: this.auto,
    tableName: this.tableName,        
    obs: this.obs,
    batchable: this.batchable.concat(q),
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

export function update(object: Object, change?: Object) {
  return Array.isArray(object) ? this.parseQueryUpdate(object) : this.parseQueryUpdate([{ set: object, in: change }]);
}