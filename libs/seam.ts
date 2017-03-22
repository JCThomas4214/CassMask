import * as Rx from 'rxjs';

/*
     USES THE PARSED OBJECT FROM FIND() OR FINDONE() 
     AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
     EXECUTE FUNCTION

     SEAM() IS USED FOR FINDS ONLY
 */

export function seam(): Rx.Observable<any> {
  // If the observable array is larger than one we will concat the observables into one
  // else we will return the only observable in the array
    // in either case we will filter out the undefined args
  
  // let obs = this.checkTable(this.obs);

  // const seamed = obs.size > 1 ? Rx.Observable.concat.apply(this, obs) : obs[0];
  return this.obs.filter(x => x); // filter out any undefined arguments from observer.next()
}