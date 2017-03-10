// Type definitions for index.js
// Project: CassMask
// Definitions by: Jason Thomas <https://github.com/JCThomas4214>

import * as Rx from 'rxjs';
import { Map } from 'immutable'; 

declare let client: any;

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

declare function now(): string;
declare function uuid(): string;
declare function toTimeStamp(timeuuid: string): string;
declare function connect(config: any, cb?: Function): void;

declare function model(modelName: string, schema: Schema, options?: any): Model;

declare class Schema {
	 tableName: string;

	 constructor(schema?: Schema | Object);
}

declare class Model {
	constructor (modelName : string | Map<any,any>, model : any, options? : any);

	find(object?: Object, opts?: Object): Model;
	findOne(object?: Object, opts?: Object): Model;
	findById(id: string, opts?: Object): Model;
	remove(object?: any, opts?: Object): Model;
	update(object: any, opts?: Object): Model;
	create(items: any, opts?: Object): Model;
	seam(): Rx.Observable<any>;

	post(hook: string | Array<string>, fn: Function): void;
	pre(hook: string | Array<string>, fn: Function): void;

	methods(scope: Object): void;

	schema: Schema;
}

declare class Entity {
	constructor (items: any, state: Map<any,any>);

	isEmpty(): boolean;
	merge(object: Object): Entity;
	save(postCb?: string): Rx.Observable<any>;
	remove(postCb?: string): Rx.Observable<any>;
}

export {
	client,
	connect,

	BLOB,
	ASCII,
	TEXT,
	VARCHAR,
	BOOLEAN,
	DOUBLE,
	FLOAT,
	BIGINT,
	INT,
	SMALLINT,
	TINYINT,
	VARINT,
	UUID,
	TIMEUUID,
	DATE,
	TIME,
	TIMESTAMP,
	INET,
	COUNTER,

	now,
	uuid,
	toTimeStamp,

	model,
	Model,
	Schema,
	Entity,
};