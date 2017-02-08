import * as Rx from 'rxjs';
import { List } from 'immutable';
import cassandra from '../index';

/*
     USES THE PARSED OBJECT FROM FIND() OR FINDONE() 
     AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
     EXECUTE FUNCTION

     SEAM() IS USED FOR FINDS ONLY
 */

export function seam() {
  const obs = this.createBatchQuery();
  return obs.size > 1 ? Rx.Observable.concat.apply(this, obs.toArray()) : obs.first();
}