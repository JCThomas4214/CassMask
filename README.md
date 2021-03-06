
[![Travis Build](https://travis-ci.org/JCThomas4214/CassMask.svg?branch=master)](https://travis-ci.org/JCThomas4214/CassMask)
[![npm version](https://img.shields.io/npm/v/cassmask.svg)](https://www.npmjs.com/package/cassmask)

# CassMask (tested with Apache-Cassandra 3.x)

#### DataTypes Thoroughly tested

+ TIMEUUID
+ UUID
+ TIMESTAMP
+ INT
+ TEXT

#### DataTypes not tested (will probably work)

+ ASCII
+ BIGINT
+ SMALLINT
+ TINYINT
+ VARCHAR
+ VARINT
+ FLOAT
+ DOUBLE
+ DECIMAL
+ BOOLEAN

#### DataTypes not tested (will probably NOT work)

+ BLOB
+ INET

#### DataTypes that WILL not work

+ COUNTER
+ MAP 
+ SET 
+ LIST 
+ User Defined Data types

## Table of Contents

1. [Why Observables?](#whyObservables)
   1. [Everything is an Observable.](#eqObservable)
2. [The Entity](#entityObject)
   1. [Important Limitations](#eIssues)
   2. [Entity Example](#entityExample)
3. [Validation](#validation)
4. [Event Hooks](#eventHooks)
   1. [Socket.io example](#sioEx)
5. [CassMask API](#cassmaskapi)
   1. [connect](#connect)
   2. [model](#model)
6. [Model API](#modelapi)
   1. [seam](#seam)
   2. [find](#find)
   3. [findOne](#findOne)
   4. [findById](#findById)
   5. [create](#create)
   6. [update](#update)
   7. [remove](#remove)
   8. [post](#post)
   9. [pre](#pre)
   10. [methods](#methods)
   11. [createIndex](#createIndex)
7. [Entity API](#entityAPI)
   1. [constructor](#entityconstructor)
   2. [isEmpty](#entityisempty)
   3. [merge](#entitymerge)
   4. [save](#entitysave)
   5. [remove](#entityremove)
8. [TODO](#TODO)

## Quick Start

```sh
$ npm install cassmask
```

Connect to Cassandra with a [ClientOptions](http://docs.datastax.com/en/developer/nodejs-driver/3.2/api/type.ClientOptions/) object.

```ts
import { connect } from 'cassmask';

// ClientOptions Object
const config = {
  contactPoints: ['127.0.0.1'],
  protocolOptions: { port: 9042 },
  queryOptions: { consistency: 1 },
  keyspace: 'demo-space'
};

connect(config, (err, result) => {
  // callback after connection
});
```

Create a model ([click here](https://github.com/JCThomas4214/CassMask/wiki/Schema) for a ES5 example)

```ts
import * as cassmask from 'cassmask';
import { toTimeStamp, now, uuid } from 'cassmask';

// An interface for your Schema is not necessary but
// it enables Typescript to type-check the key-value paires
// placed into cassmask's query functions
interface IModelSchema extends cassmask.ISchema {
  col1?: cassmask.UUID;
  col2?: cassmask.TIMEUUID;
  col3?: cassmask.TIMESTAMP;
  col4?: cassmask.TEXT;
  col5?: cassmask.INT;  
}

class ModelSchema extends cassmask.Schema {
  // declare schema type values
  col1 = {
    type: cassmask.UUID,
    default: uuid()
  };
  col2 = {
    type: cassmask.TIMEUUID,
    default: now()
  };
  col3 = {
    type: cassmask.TIMESTAMP,
    default: toTimeStamp(now())
  };
  col4 = {
    type: cassmask.TEXT,
    required: true
  };
  col5 = {
    type: cassmask.INT,
    required: 'Col5 must be present!!'
  };
  // Primary Keys (Partition & Clustering Column)
  keys = ['col1', 'col2'];

  constructor() {
    super();
  }

  // Define validate_[column name] function to create
  //    a validate function for that key

  validate_col4(col4, next) {
    if(col4.length >= 5) next();
    else next('col4 is not long enough!');
  }

  validate_col5(col5, next) {
    if(col5 >= 5) next();
    else next('col5 value is not large enough!');
  }

  // Define pre_create, pre_update, pre_remove, pre_find
  //    post_create, post_update, post_remove, post_find
  //    functions to set hook events

  pre_create(next, err) {
    this.col4 += ' test pre hook!';
    next();
  }

  // Other defined functions will be integrated into Entity scope
}

export default cassmask.model<IModelSchema>('Model', new ModelSchema());
```

Find, create, remove, update...

```ts
import Model from 'path/to/model.ts';

let holder = [];

/*
  Existing rows in Model Table
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before1 test pre hook!', col5: 6 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before2 test pre hook!', col5: 7 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before3 test pre hook!', col5: 8 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before4 test pre hook!', col5: 9 }

*/

Model.create([{
  col4: 'test1',
  col5: 49
}, {
  col4: 'test2',
  col5: 23
}, {
  col4: 'test3',
  col5: 97
}, {
  col4: 'test4',
  col5: 57
}]).remove([{
  col1: 'generated uuid', // before2
  col2: 'generated timeuuid'
}, {
  col1: 'generated uuid', // before4
  col2: 'generated timeuuid'
}]).find().seam().subscribe( // Every next argument will be an Entity object for every query executed
  x => holder.push(x),
  err => console.log(err),
  () => {}
);

/*  
  Model Table
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before1 test pre hook!', col5: 6 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before3 test pre hook!', col5: 8 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test1 test pre hook!', col5: 49 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test2 test pre hook!', col5: 23 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test3 test pre hook!', col5: 97 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test4 test pre hook!', col5: 57 }
*/
```

<a name="whyObservables"></a>

# Why Observables?

Observables are fancy promises that operate under event streams which give us opportunities to seam these streams together and filter results. For more information about observables and the [ReactiveX](http://reactivex.io/) RxJS library [click here](http://reactivex.io/rxjs/).

<a name="eqObservable"></a>

## Everything is an Observable.

In CassMask every query, event hook, and validation is executed inside an observable and it uses RxJS [concatenate](http://reactivex.io/documentation/operators/concat.html) to seam them together to ensure proper sequence on subscribe.

<a name="eventSeq"></a>

## Event Sequence Per Query Function/Query Object

| REQUIRE -> | VALIDATION -> | PRE -> | QUERY -> | POST |
|:-------:|:-------------:|:------:|:--------:|:----:|
| condition | function | function | function | function |

_NOTE: require is create specific and validation is create/update specific_

<a name="entityObject"></a>

## The Entity.

Once a query is executed in the stream an Entity object (or array of Entities) will be passed as the observer.next() argument giving the developer an opportunity to interact with it. The Entity object gives us access to a couple useful functions, save() and remove(). Save() will take the current attributes of the Entity and create a query string to UPDATE (INSERT) a row in the table. Similar to save(), remove() will take the current attributes and DELETE from the table. An Entity (or array of Entities) will be created from either the response row array from the corresponding query, or if the query does not respond with data (UPDATE, INSERT, DELETE), will be created from the key value pairs that were used in the original Schema query function.

<a name="eIssues"></a>

### Important Limitations.

In order to use CassMask well, it's important to understand CQL. If the query does not respond with data (SELECT) then a particular Entity instance may not have the attributes to INSERT, UPDATE, and/or DELETE rows in a table. Specifically the necessary [Partition Key](https://docs.datastax.com/en/cql/3.3/cql/cql_using/useSimplePrimaryKeyConcept.html#useSimplePrimaryKeyConcept) and [Clustering Columns](https://docs.datastax.com/en/cql/3.3/cql/cql_using/useCompoundPrimaryKey.html) to obtain the specificity required to UPDATE/DELETE a certain row. The remove() and update() querying functions in your Schema object will require your Primary Keys in order to function correctly so the problem is not as apparent as create() where certain keys may be generated on the database itself (uuid, timeuuid, timestamp, etc..).

An [event hook](#eventHooks) could be used to protentially solve this delema. We could hook into the 'create' event and execute a SELECT query to find the most recently appended row and pass this object through the observer.next() argument, which could be used in your endpoint. This is not done automatically because of the level of involvement required to create tables with a certain clustering order.

<a name="entityExample"></a>

### Entity Example

```ts
let holder = [];

// findOne with no argument will find the first row in the
// table and pass an Entity with the found row to next()

// find with no argument will find the all rows in the
// table and pass an Entity with the found rows to next()
Model.findOne().find().seam().subscribe( // two queries are executed and two next() functions are called
  model => holder.push(model),
  err => console.log(err),
  () => {
    holder[0].col4 = 'awesome_example'; // index 0 is the findOne query argument
    holder[0].col5 = 49;

    /*  
      Model Table after holder[0].save() but before holder[1] interaction
        { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'awesome_example', col5: 49 }
        { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before3', col5: 2 }
        { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test1', col5: 49 }
        { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test2', col5: 23 }
        { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test3', col5: 97 }
        { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test4', col5: 57 }
    */  

    holder[0].save().subscribe(model => {

      holder[1].forEach(entity => { // holder[1] is an array of Entity Object from find()
        entity.col4 = 'awesome_example2';
        entity.col5 = 99;
        entity.save().subscribe(x => {}, err => console.log(err));
      });

    }, err => console.log(err));
  });

/*  
  Model Table after holder[1] interaction
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'awesome_example2', col5: 99 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'awesome_example2', col5: 99 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'awesome_example2', col5: 99 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'awesome_example2', col5: 99 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'awesome_example2', col5: 99 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'awesome_example2', col5: 99 }
*/

```
<!---
<a name="batching"></a>

## Batching!

Batching is not always practical in Cassandra because of how it partitions the data to Nodes/SSTables. Batching is best practice if and only if the INSERTS, UPDATES, and DELETES are for a single partition.

In CassMask batching is currently only availiable per function basis and is off by default. If you would like to enable it, simply pass in a Object with batch = true as the second argument.

```ts
// Parititon key = catagory
Model.remove().create([{
    catagory: 'cloud',
    id: now(),
    name: 'SocketIO',
    xcoor: 52,
    ycoor: 15
  }, {
    catagory: 'cloud',
    id: now(),
    name: 'Cassandra',
    xcoor: 35,
    ycoor: 35
  }, {
    catagory: 'cloud',
    id: now(),
    name: 'Angular 2',
    xcoor: 10,
    ycoor: 65
  }], { batch: true }).seam().subscribe(x => {}, err => console.log(err));
```

<a name="tcbBatching"></a>

### Things to consider before batching.

When batching, multiple queries are condenced into a single query with multiple statements. If you would like event driven features you will need to keep in mind that the CassMask Event API will only be triggered (depending on the hook) once per query response. Depending on your use case an emit per INSERT, UPDATE, and/or DELETE may be preferable.
-->
<a name="validation"></a>

## Validation

Validation in CassMask can be configured per schema property basis. Configure a validation function to pass an error message and stop the event stream when conditions are not met.

### Valiation Example ([click here](https://github.com/JCThomas4214/CassMask/wiki/Validation) for an ES5 example)  

```ts
interface IModelSchema extends cassmask.ISchema {
  id?: cassmask.UUID;
  name?: cassmask.TEXT;
  points?: cassmask.INT;
}

class ModelSchema extends cassmask.Schema {
  // declare schema type values
  id = {
    type: cassmask.UUID,
    default: uuid()
  };
  name = {
    type: cassmask.TEXT,
    required: 'Must have name!'
  };
  points = cassmask.INT;
  // Primary Keys (Partition & Clustering Column)
  keys = ['id', 'name'];

  constructor() {
    super();
  }

  // Define validate_[column name] function to create
  //    a validate function for that key

  validate_name(name, next) {
    if(name.length >= 5) next();
    else next('name is not long enough!');
  }
}

export default cassmask.model<IModelSchema>('Model', new ModelSchema());
```

<a name="eventHooks"></a>

## Event Hooks

In CassMask there are PRE and POST event hooks for 'create', 'update', 'remove', and 'find'. These hooks are embedded inside each Entity (Instance) scope and they can be used to interact with the Entity object in the stream before/after a corresponding query execution/response.

<a name="sioEx"></a>

### Socket.io example

events.ts

```ts
import Model from './path/to/model.ts';

let EventEmitter = require('events').EventEmitter;
let ModelEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ModelEvents.setMaxListeners(0);

/*
  The lastEntity; for create(), update(), and remove(): Entity object that was originally passed into the query
    for find() and findOne(): the rows found in the table
  the next; this is a callback that expects zero or one argument.
    callback will call observer next() and complete() functions
    argument will be passed into next()
  The client; this is the cassandra client, which can be used to execute additional queries

 */
Model.post('create', function(next, err) {
  // callback code goes here

  Model.Events.emit('create', this);

  next(this);
});

export default ModelEvents;

```

socket.ts

```ts
/**
 * Broadcast updates to client when the model changes
 */

import ModelEvents from './path/to/events.ts';

// Model events to emit
let events = ['create'];

function modelRegister(socket) {
  // Bind model events to socket events
  for (let i = 0, eventsLength = events.length; i < eventsLength; i++) {
    let event = events[i];
    let listener = createListener('Model:' + event, socket);

    // the Emitter will listen for changes in the model
    ModelEvents.on(event, listener);
    // when a disconnect comes from the socket then remove the listener
    socket.on('disconnect', removeListener(event, listener));
  }
}

// create listener funtion
function createListener(event, socket) {
  return function(row) {
    socket.emit(event, row);
  };
}

// remove listener function
function removeListener(event, listener) {
  return function() {
    ModelEvents.removeListener(event, listener);
  };
}

export default modelRegister;
```

execute modelRegister(socket) in your socketio.config onConnect function

<a name="cassmaskapi"></a>

## CassMask API

<a name="connect"></a>

#### [connect](https://github.com/JCThomas4214/CassMask/blob/master/index.ts)(config: [ClientOptions](http://docs.datastax.com/en/developer/nodejs-driver/3.2/api/type.ClientOptions/), cb: Function): void

+ connects to the cassandra nodes
+ cb function to be fired once connection sring returns

<a name="model"></a>

#### [model](https://github.com/JCThomas4214/CassMask/blob/master/index.ts)(tableName: string, schema: Schema, indexes?: Array\<string | Array\<string\>\>): Model

+ creates a Model object with querying capabilities 
+ indexes is an array of secondary indexes you can create for this model's table
   + NOTE: to change/add the indexes you will need to drop the table for cassmask to create it again


<a name="modelapi"></a>

## Model API

<a name="seam"></a>

#### [seam](https://github.com/JCThomas4214/CassMask/blob/master/libs/seam.ts)(): Rx.Observable\<any\>

+ returns single concatenated observables

<a name="find"></a>

#### [find](https://github.com/JCThomas4214/CassMask/blob/master/libs/find.ts)(items?: Object, opts?: [FindOptions](#findoptions)): Schema

+ first argument can be empty or an object
  + If no arguments or empty object, will SELECT all rows in the table
+ first argument should contain the columns for the WHERE clause
  + columns should be in the same order as the primary keys
+ second argument is a find options object
  + options.attributes: Array<string> | Object, columns to be included in the SELECT response
    + if attributes is an object, exclude: Array<string> will exclude columns from the SELECT response
+ query will return an array of object or a single object

<a name="findOne"></a>

#### [findOne](https://github.com/JCThomas4214/CassMask/blob/master/libs/findOne.ts)(items?: Object, opts?: [FindOptions](#findoptions)): Schema

+ first argument can be empty or an object
  + If no arguments or empty object, will SELECT the first row in the table
+ first argument should contain the columns for the WHERE clause
  + columns should be in the same order as the primary keys
+ second argument is a find options object
  + options.attributes: Array<string> | Object, columns to be included in the SELECT response
    + if attributes is an object, exclude: Array<string> will exclude columns from the SELECT response
+ query will return a single object

<a name="findById"></a>

#### [findById](https://github.com/JCThomas4214/CassMask/blob/master/libs/findById.ts)(id: string, opts? [FindOptions](#findoptions)): Schema

+ first argument must be an id
+ second argument is a find options object
  + options.attributes: Array<string> | Object, columns to be included in the SELECT response
    + if attributes is an object, exclude: Array<string> will exclude columns from the SELECT response
+ query will return a single or array of objects depending schema design

<a name="create"></a>

#### [create](https://github.com/JCThomas4214/CassMask/blob/master/libs/create.ts)(items: Object | Array\<Object\>, opts?: [SchemaOptions](#schemaoptions)): Schema

+ first argument can be an object or array of objects
+ objects must contain all columns to be inserted into the row
  + primary keys are mandatory

<a name="update"></a>

#### [update](https://github.com/JCThomas4214/CassMask/blob/master/libs/update.ts)(object: [UpdateObject](#updateobject) | Array\<[UpdateObject](#updateobject)\>, opts?: [SchemaOptions](#schemaoptions)): Schema

+ first argument can be an object or array of objects
+ objects must contain two subobjects, 'set' and 'where'
  + 'set' should contain all the columns you wish to SET (primary keys not allowed)
  + 'where' should contain the primary key columns to find the row to UPDATE

<a name="remove"></a>

#### [remove](https://github.com/JCThomas4214/CassMask/blob/master/libs/remove.ts)(object?: Object | Array\<Object\>, opts?: [SchemaOptions](#schemaoptions)): Schema

+ first argument can be empty, an object, or array of objects
+ objects must contain the primary keys for the WHERE clause to DELETE the row

<a name="post"></a>

#### [post](https://github.com/JCThomas4214/CassMask/blob/master/libs/events.ts)(hook: string | Array\<string\>, cb: Function): void;

+ specify one or multiple hooks ('create', 'update', 'remove', or 'find') as the first argument
+ specify the callback as the function to execute
  + callback passes two arguments, next(object?), err(message?), and entity: Entity | Array<Entity>
  + callback must call one of them
+ sets the cooresponding hook function the Schema/Entity scopes

<a name="pre"></a>

#### [pre](https://github.com/JCThomas4214/CassMask/blob/master/libs/events.ts)(hook: string | Array\<string\>, cb: Function): void;

+ specify one or multiple hooks ('create', 'update', 'remove', or 'find') as the first argument
+ specify the callback as the function to execute
  + callback passes two arguments, next(object?), err(message?), and entity which are both functions
  + callback must call one of them
+ sets the cooresponding hook function the Schema/Entity scopes

<a name="methods"></a>

#### [methods](https://github.com/JCThomas4214/CassMask/blob/master/index.ts)(scope: Object): void;

+ scope object containing properties that will be integrated into all instantiated Entity objects

<a name="createIndex"></a>

#### [createIndex](https://github.com/JCThomas4214/CassMask/blob/master/index.ts)(indexes: string | Array\<string | Array\<string\>\>): void

+ creates a secondary index for the talbe on table creation
   + NOTE: to change/add the indexes you will need to drop the table for cassmask to create it again

<a name="updateobject"></a>

#### UpdateObject

+ set: Object; object with table attribute key value pairs to update
+ where: Object; object with PRIMARY KEY key value pairs
  + ex: { set: {name: 'test'}, where: {id: '123456'}}

<a name="schemaoptions"></a>

#### SchemaOptions

+ using?: string; is the CQL update parameter(s) appended in the INSERT, DELETE, UPDATE string
  + ex: {using: 'TTL 86400'}
+ if?: string; is the CQL conditions to execute INSERT, DELETE, UPDATE string
  + ex: {if: 'exists'}
  + ex: {if: 'played > 10'}

<a name="findoptions"></a>

#### FindOptions

+ attributes?: Array<string | Object>; "columns to select or exclude from SELECT query"
  + ex: {attributes: ['name', 'created', 'id']}
  + ex: {attributes: {exclude: ['catagory']}}
+ groupBy?: string; CQL group by string to append to SELECT query
  + ex: {groupBy: 'created, name'}
+ orderBy?: string; CQL order by string to append to SELECT query
  + ex: {orderBy: 'created desc'}
+ perParitionLimit?: number; limit select per partition
  + ex: {perPartitionLimit: 3}
+ limit?: number; limit the SELECT response to certain number of rows
  + ex: {limit: 1}
+ allowFiltering?: boolean; append ALLOW FILTERING to query string
  + ex: {allowFiltering: true}
  + **It is recommended that this not be used as it causes cluster wide search**

####

<a name="entityAPI"></a>

## Entity API

<a name="entityconstructor"></a>

#### new [Entity](https://github.com/JCThomas4214/CassMask/blob/master/libs/entity.ts)(item: Object, model: Schema)

+ item should be an object with the key value pairs for a row in a table
+ state should be the Schema state this Entity belongs to
  + every Schema will have a state which contains all the important information regarding the model, table, and more

```ts
import { Entity } from 'cassmask';
import Model from '/path/to/model.ts';

const object = {
  col1: [uuid],
  col2: [timeuuid],
  col3: [created time],
  col4: 'awesome',
  col5: 67
};

let entity = new Entity(object, Model);
entity.save();
```

<a name="entityisempty"></a>

#### [isEmpty](https://github.com/JCThomas4214/CassMask/blob/master/libs/entity.ts)(): boolean

+ will return true if no column attributes are set in the Entity object
+ else false

<a name="entitymerge"></a>

#### [merge](https://github.com/JCThomas4214/CassMask/blob/master/libs/entity.ts)(item: Object): Entity

+ will merge object will the Entity, overriding any matching attributes in the Entity with the object's

<a name="entitysave"></a>

#### [save](https://github.com/JCThomas4214/CassMask/blob/master/libs/entity.ts)(): Rx.Observable<any>

+ creates a query string based off this Entity's attributes
+ will distinguish if the query is an update or insert and execute the appropriate post callback
+ will NOT execute a pre callback as the object
+ executes UPDATE query on subscribe

<a name="entityremove"></a>

#### [remove](https://github.com/JCThomas4214/CassMask/blob/master/libs/entity.ts)(): Rx.Observable<any>

+ creates a query string based off this Entity's attributes
+ will NOT execute a pre callback as the object
+ executes DELETE query on subscribe

<a name="TODO"></a>

## TODO

+ Data Type support (Map, Sets, Lists, custom)
