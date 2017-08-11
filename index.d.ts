// Type definitions for index.js
// Project: CassMask
// Definitions by: Jason Thomas <https://github.com/JCThomas4214>

import * as Rx from 'rxjs';

export declare type MAP = Object;
export declare type LIST<L> = Array<L>;
export declare type SET<P> = Array<P>;

declare type BLOB = string;
declare type ASCII = string;
declare type TEXT = string;
declare type VARCHAR = string;
declare type BOOLEAN = string;
declare type DOUBLE = string;
declare type FLOAT = string;
declare type BIGINT = string;
declare type INT = string;
declare type SMALLINT = string;
declare type TINYINT = string;
declare type VARINT = string;
declare type UUID = string;
declare type TIMEUUID = string;
declare type DATE = string;
declare type TIME = string;
declare type TIMESTAMP = string;
declare type INET = string;
declare type COUNTER = string;

declare function MAP(keyType: string, valType: string): string;
declare function LIST(valType: string): string;
declare function SET(valType: string): string;

declare const BLOB: string;
declare const ASCII: string;
declare const TEXT: string;
declare const VARCHAR: string;
declare const BOOLEAN: string;
declare const DOUBLE: string;
declare const FLOAT: string;
declare const BIGINT: string;
declare const INT: string;
declare const SMALLINT: string;
declare const TINYINT: string;
declare const VARINT: string;
declare const UUID: string;
declare const TIMEUUID: string;
declare const DATE: string;
declare const TIME: string;
declare const TIMESTAMP: string;
declare const INET: string;
declare const COUNTER: string;

declare module "cassmask" {
	let client: any;

	interface UpdateObject<K> {
		set: K,
		where: K
	}

	interface SchemaOptions {
		using?: string,
		if?: string
	}

	interface Exclude {
		exclude: Array<string>;
	}

	interface FindOptions {
		attributes?: Array<string> | Exclude,
		groupBy?: string,
		orderBy?: string,
		perPartitionLimit?: number,
		limit?: number,
		allowFiltering?: boolean
	}

	interface BatchOptions {
		using?: string
	}

	interface MapAction {
	  action: string,
	  index?: any,
	  payload?: any
	}

	interface ListAction {
	  action: string,
	  index?: any,
	  payload?: any
	}

	export interface SetAction {
	  action: string,
	  index?: any,
	  payload?: any 
	}

	namespace MAP {
		export function schemaString(keyType: string, valType: string): string;
		export function append(keyVal: Object): MapAction;
		export function set(set: any, val: any): MapAction;
		export function reset(keyVal: Object): MapAction;
		export function remove(keys: Array<string>): MapAction;
	}

	namespace LIST {
		export function schemaString(valType: string): string;
		export function append(keyVal: Object): ListAction;
		export function prepend(keyVal: Object): ListAction;
		export function set(set: any, val: any): ListAction;
		export function reset(keyVal: Object): ListAction;
		export function remove(keys: number | string): ListAction
	}

	namespace SET {
		export function schemaString(valType: string): string;
		export function append(keyVal: Object): SetAction;
		export function prepend(keyVal: Object): SetAction;
		export function set(set: any, val: any): SetAction;
		export function reset(keyVal: Object): SetAction;
		export function remove(keys: number | string): SetAction;
	}

	function now(): string;
	function uuid(): string;
	function toTimeStamp(timeuuid: string): string;
	function connect(config: any, cb?: Function): void;

	function model<T>(modelName: string, schema: Schema, indexes?: Array<string | Array<string>>): Model<T>;

	interface ISchema {
		id?: string
	}

	class Schema {
		model: Model<any>;

		constructor(schema?: Schema | Object);

		methods(scope: Object): void;
		validate(path: string, fn: Function): void;

		post(hook: string | Array<string>, fn: Function): void;
		pre(hook: string | Array<string>, fn: Function): void;
	}

	class Model<J> {
		constructor (modelName : string | Model<J>, schema: Schema, options? : any);

		find(object?: J, opts?: FindOptions): Model<J>;
		findOne(object?: J, opts?: FindOptions): Model<J>;
		findById(id: string, opts?: FindOptions): Model<J>;
		remove(object?: J | Array<J>, opts?: SchemaOptions): Model<J>;
		update(object: UpdateObject<J> | Array<UpdateObject<J>>, opts?: SchemaOptions): Model<J>;
		create(items: J | Array<J>, opts?: SchemaOptions): Model<J>;
		seam(): Rx.Observable<any>;

		cdExecute(query: string, params?: Array<string|number>, options?, cb?: Function);
		cdBatch(queries: Array<string>|Array<{ query:string, params:Array<string|number> }>, options?, cb: Function);

		// batch(items: Array<Object>, opt?: BatchOptions): Rx.Observable<any>;

		methods(scope: Object): void;
		validate(path: string, fn: Function): void;

		post(hook: string | Array<string>, fn: Function): void;
		pre(hook: string | Array<string>, fn: Function): void;

		schema: Schema;

		createIndex(property: string): void;
		insertJsonBatch(obj: Array<Object>, options: Object): Rx.Observable<any>;
	}

	class Entity {
		constructor (items: any, parent: Model<any>);

		isEmpty(): boolean;
		merge(object: Object): Entity;
		save(postCb?: string): Rx.Observable<any>;
		remove(postCb?: string): Rx.Observable<any>;
	}

}
