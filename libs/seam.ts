import * as Rx from 'rxjs';
import { List } from 'immutable';

/*
     USES THE PARSED OBJECT FROM FIND() OR FINDONE() 
     AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
     EXECUTE FUNCTION

     SEAM() IS USED FOR FINDS ONLY
 */

export function seam() {
	// If the observable array is larger than one we will concat the observables into one
	// else we will return the only observable in the array
		// in either case we will filter out the undefined returns
	const seamed = this.state.get('obs').size > 1 ? 
		Rx.Observable.concat.apply(this, this.state.get('obs').toArray()) : 
		this.state.get('obs').first();

	return seamed.filter(x => x);
}