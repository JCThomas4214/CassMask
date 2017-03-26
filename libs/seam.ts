import * as Rx from 'rxjs';

export function seam(): Rx.Observable<any> {
  // If the observable array is larger than one we will concat the observables into one
  // else we will return the only observable in the array
    // in either case we will filter out the undefined args
  
  return this.checkTable(this.obs).filter(x => x); // filter out any undefined arguments from observer.next()
}