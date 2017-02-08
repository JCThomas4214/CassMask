// Type definitions for index.js
// Project: CassMask
// Definitions by: Jason Thomas <https://github.com/JCThomas4214>

import * as Rx from 'rxjs';

interface Schema_static {
	new (modelName : any, model : any, options? : any): Schema;
}

interface Schema {

	find(object?:Object, opts?:any): Schema;
	findOne(object?:Object, opts?:any): Schema;
	remove(object?:Object): Schema;
	update(object:Object, change?:Object): Schema;
	create(items: any): Schema;
	seam(): Rx.Observable<any>;
}

declare namespace cassandra {
	export var client : any;
	export var TEXT : string;		
	export var INT : string;	 
	export var UUID : string;		
	export var TIMEUUID : string;		
	export var TIMESTAMP : string;

	export function connect(config : any, cb : any): void;

	export var Schema: Schema_static;
}

export = cassandra;