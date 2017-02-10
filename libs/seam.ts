import * as Rx from 'rxjs';
import { List } from 'immutable';

/*
     USES THE PARSED OBJECT FROM FIND() OR FINDONE() 
     AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
     EXECUTE FUNCTION

     SEAM() IS USED FOR FINDS ONLY
 */

export function seam() {
  const obs = this.obs.concat([]);
  console.log(obs.toArray());
  return obs.size > 1 ? Rx.Observable.concat.apply(this, obs.toArray()) : obs.first();
}