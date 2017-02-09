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
	remove(object?:any): Schema;
	update(object:any, change?:Object): Schema;
	create(items: any): Schema;
	seam(): Rx.Observable<any>;
}

declare function now(): string;
declare function uuid(): string;
declare function toTimeStamp(timeuuid: string): string;

declare namespace cassandra {
	export var client : any;
	export var TEXT : string;		
	export var INT : string;	 
	export var UUID : string;		
	export var TIMEUUID : string;		
	export var TIMESTAMP : string;

	export function connect(config : any, cb : any): void;
}

declare namespace Schema {
	export function find(object?:Object, opts?:any): Schema;
	export function findOne(object?:Object, opts?:any): Schema;
	export function remove(object?:any): Schema;
	export function update(object:any, change?:Object): Schema;
	export function create(items: any): Schema;
	export function seam(): Rx.Observable<any>;
}

export {
	cassandra,
	Schema,
	now,
	uuid,
	toTimeStamp
};