
[![npm version](https://img.shields.io/npm/v/cassmask.svg)](https://www.npmjs.com/package/cassmask)

# CassMask

### "Inspired by [MongooseJS](http://mongoosejs.com/) with a twist!"

This ORM is in alpha and is not suggested for production as core features have not yet been implemented/finalized. If you would like to contribute you are welcome to Fork and pull request. Visit the [TODO](#TODO) section for points of interest. All files have been thoroughly commented 

#### Currently unsupported data types

+ Counter (has not been tested yet)
+ Maps
+ User Defined Data types

## Table of Contents

1. [Why Observables?](#whyObservables)
  1. [Every Query is an Observable.](#eqObservable)
2. [The Entity](#entityObject)
  1. [Important Limitations](#eIssues)
  2. [Entity Example](#entityExample)
3. [Event Hooks](#eventHooks)
  1. [Socket.io example](#sioEx)
4. [Features](#features)
5. [CassMask API](#cassmaskapi)
  1. [connect](#connect)
6. [Model API](#modelapi)
  1. [seam](#seam)
  2. [find](#find)
  3. [findOne](#findOne)
  4. [create](#create)
  5. [update](#update)
  6. [remove](#remove)
  7. [post](#post)
  8. [pre](#pre)
7. [Entity API](#entityAPI)
  1. [constructor](#entityconstructor)
  2. [save](#entitysave)
  3. [remove](#entityremove)
8. [TODO](#TODO)

## Quick Start

```sh
$ npm install cassmask
```

Connect to Cassandra with a [ClientOptions](http://docs.datastax.com/en/developer/nodejs-driver/3.2/api/type.ClientOptions/) object.

```ts
import { cassandra } from 'cassmask';

// ClientOptions Object
const config = {
  contactPoints: ['127.0.0.1'],
  protocolOptions: { port: 9042 },
  queryOptions: { consistency: 1 },
  keyspace: 'demo-space'
};

cassandra.connect(config, (err, result) => {
  // callback after connection  
});
```

Create a model.

```ts
import { cassandra, Schema } from 'cassmask';

let Model = new Schema('TableName', {
  col1: {
    Type: cassandra.UUID,
    Default: uuid()
  },
  col2: {
    Type: cassandra.TIMEUUID,
    Default: now()
  },
  col3: {
    Type: cassandra.TIMESTAMP,
    Default: toTimeStamp(now())
  },
  col4: cassandra.TEXT,
  cal5: cassandra.INT,
  // Primary Keys (Partition & Clustering Column)
  keys: ['col1', 'col2']
});

export default Model;
```

Find, create, remove, update...

```ts
import { now, uuid, toTimeStamp } from 'cassmask';
import Model from 'path/to/model.ts';

let holder = [];

/*
  Existing rows in Model Table
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before1', col5: 0 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before2', col5: 1 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before3', col5: 2 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before4', col5: 3 }
    
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
  () => console.log(holder[holder.length - 1])
);

/*  
  Model Table
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before1', col5: 0 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before3', col5: 2 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test1', col5: 49 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test2', col5: 23 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test3', col5: 97 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test4', col5: 57 }
*/
```
> Note: Cassmask on first model instance query will create a table based off the model if the table does not exist => Holder index might be index+1

<a name="whyObservables"></a>

# Why Observables?

Observables are basically fancy promises that operate under event streams which give us very interesting opportunities to seam sets of queries and filter results. For more information about observables and the [ReactiveX](http://reactivex.io/) RxJS library [click here](http://reactivex.io/rxjs/).

<a name="eqObservable"></a>

## Every Query is an Observable.

In CassMask every query executes in an observable and passes an Entity object through the observer.next() argument. The more query functions you seam together the more Observables will be [concatenated](http://reactivex.io/documentation/operators/concat.html) together, creating the final seamed observable that will be subscribed to passing Entities you can interact with.

<a name="entityObject"></a>

## The Entity.

Similar to Javascript [Promise](https://www.promisejs.org/)'s resolve argument, once observer.next() is called per observable basis, an Entity object is passed as the argument giving you an opportunity to interact with it. The Entity object give access to a couple useful functions, save() and remove(). Save() will take the current properties and create a query string to UPDATE (INSERT) a row in the table. Similar to save(), remove() will take the current properties and DELETE from the table. The Entity properties will instantiate from either the response row from the corresponding query or if the query does not respond with data (UPDATE, INSERT, DELETE), holds the key value pairs that were inputted for the query in the first place.

<a name="eIssues"></a>

### Important Limitations.

This of course poses some issues. If the query does not respond with data then a particular Entity instance may not have the properties to INSERT, UPDATE, and/or DELETE rows in a table. Specifically the necessary [Partition Key](https://docs.datastax.com/en/cql/3.3/cql/cql_using/useSimplePrimaryKeyConcept.html#useSimplePrimaryKeyConcept) and [Clustering Columns](https://docs.datastax.com/en/cql/3.3/cql/cql_using/useCompoundPrimaryKey.html) to obtain the specificity required to UPDATE/DELETE a certain row. The remove() and update() querying functions in your Schema object will require your Primary Keys in order to function correctly so the problem is not as apparent as create() where certain keys may be generated on the database itself (uuid, timeuuid, timestamp, etc..).

An [event hook](#eventHooks) could be used to protentially solve this delema. For the create() Schema function we could hook into the 'save' event query promise and execute a SELECT query to find the most recently appended row and pass this object through the observer.next() argument, which could be used in your endpoint. This is not done automatically because of the level of involvement required to create tables for sorting.

<a name="entityExample"></a>

### Entity Example

```ts
let holder = [];

// findOne with no argument will find the first row in the 
// table and pass an Entity with the found row's properties to next() 

// find with no argument will find the all rows in the 
// table and pass an Entity with the found row's properties to next() 
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
<a name="eventHooks"></a>

## Event Hooks

In CassMask there are PRE and POST event hooks for 'create', 'update', 'remove', and 'find', embedded inside each Entity (Instance) scope that can be used to trigger a callback after a corresponding query. This callback is executed before the observer.next() and observer.complete() functions are called.

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
Model.post('save', function(lastEntity, next, client) {
  // callback code goes here

  Model.Events.emit('save', lastEntity);
  
  next(lastEntity);
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
let events = ['save'];

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

<a name="features"></a>

# Features

+ It uses the most up to date [Cassandra-Driver](https://github.com/datastax/nodejs-driver) from DataStax so all the features it has CassMask will have too. 
+ It creates a table based off the model if it does not already exist. 
+ It gives you all the tools availiable in CQL mapped in an easy to use api.
+ It allows you to seam together queries, using observables, garunteeing all queries are executed in the proper sequence.
+ It has an Events API that allow you to hook into query responses for event driven features

<a name="cassmaskapi"></a>

## CassMask API

<a name="connect"></a>

#### [connect]()(config: [ClientOptions](http://docs.datastax.com/en/developer/nodejs-driver/3.2/api/type.ClientOptions/), cb: Function): void 

+ connects to the cassandra nodes
+ cb function to be fired once connection sring returns

<a name="modelapi"></a>

## Model API

<a name="seam"></a>

#### [seam]()(): Rx.Observable\<any\>

+ returns joined observables

<a name="find"></a>

#### [find]()(items?: Object, opts?: Object): Schema

+ first argument can be empty or an object
  + If no arguments or empty object, will SELECT all rows in the table
+ first argument should contain the columns for the WHERE clause
  + columns should be in the same order as the primary keys
+ query will return an array of object or a single object

<a name="findOne"></a>

#### [findOne]()(items?: Object, opts?: Object): Schema

+ first argument can be empty or an object
  + If no arguments or empty object, will SELECT the first row in the table
+ first argument should contain the columns for the WHERE clause
  + columns should be in the same order as the primary keys
+ query will return a single object

<a name="create"></a>

#### [create]()(items: [Object || Array\<Object\>], opts?: Object): Schema

+ first argument can be an object or array of objects
+ objects must contain all columns to be inserted into the row
  + primary keys are mandatory

<a name="update"></a>

#### [update]()(object: [Object || Array\<Object\>], opts?: Object): Schema

+ first argument can be an object or array of objects
+ objects must contain two subobjects, 'set' and 'where'
  + 'set' should contain all the columns you wish to SET (primary keys not allowed)
  + 'where' should contain the primary key columns to find the row to UPDATE

<a name="remove"></a>

#### [remove]()(object?: [Object || Array\<Object\>], opts?: Object): Schema

+ first argument can be empty, an object, or array of objects
+ objects must contain the primary keys for the WHERE clause to DELETE the row

<a name="post"></a>

#### [post]()(hook: string | Array<string>, cb: Function): void;

+ specify one or multiple hooks ('create', 'update', 'remove', or 'find') as the first argument
+ specify the callback as the function to execute
  + callback passes two arguments, next(object?), err(message?), and entity: Entity | Array<Entity>
  + callback must call one of them

<a name="pre"></a>

#### [pre]()(hook: string | Array<string>, cb: Function): void;

+ specify one or multiple hooks ('create', 'update', 'remove', or 'find') as the first argument
+ specify the callback as the function to execute
  + callback passes two arguments, next(object?), err(message?), and entity which are both functions
  + callback must call one of them

<a name="entityAPI"></a>

## Entity API

<a name="entityconstructor"></a>

#### new [Entity]()(item: Object, state: Map\<any,any\>)

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

<a name="entitysave"></a>

#### [save]()(): Rx.Observable<any>

+ creates a query string based off this Entity's attributes
+ will distinguish if the query is an update or insert and execute the appropriate post callback
+ will NOT execute a pre callback as the object 
+ executes UPDATE query on subscribe

<a name="entityremove"></a>

#### [remove]()(): Rx.Observable<any>

+ creates a query string based off this Entity's attributes
+ will NOT execute a pre callback as the object
+ executes DELETE query on subscribe

<a name="TODO"></a>

## TODO

+ Data Type support (Map, custom)
+ Virtual fields
+ Validation
