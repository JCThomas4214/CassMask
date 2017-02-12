// Type definitions for index.js
// Project: CassMask
// Definitions by: Jason Thomas <https://github.com/JCThomas4214>

import * as Rx from 'rxjs';
import { Map } from 'immutable'; 

// interface Events_static {
// 	new (parent: Schema): Events;
// }
interface Events {
	post(method: string, fn: Function): void;
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

declare class Schema {
	constructor (modelName : any, model : any, options? : any);

	find(object?:Object, opts?:any): Schema;
	findOne(object?:Object, opts?:any): Schema;
	remove(object?:any, opts?: Object): Schema;
	update(object:any, opts?: Object): Schema;
	create(items: any, opts?: Object): Schema;
	seam(): Rx.Observable<any>;

	schema: Events;
}

declare class Entity {
	constructor (items: any, state: Map<any,any>);

	save(): Rx.Observable<any>;
	remove(): Rx.Observable<any>;
}

export {
	cassandra,
	Schema,
	Entity,
	now,
	uuid,
	toTimeStamp
};