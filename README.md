
[![npm version](https://img.shields.io/npm/v/cassmask.svg)](https://www.npmjs.com/package/cassmask)

# CassMask

### "Inspired by [MongooseJS](http://mongoosejs.com/) with a twist!"

This ORM is a work in progress and is not suggested for production as core features have not yet been implimented. Contributors are welcome to Fork and pull request. Visit the [TODO](#TODO) section for what needs to be done. 

## Quick Start

```sh
$ npm install cassmask rxjs immmutable cassandra-driver
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
  col1: cassandra.UUID,
  col2: cassandra.TIMEUUID,
  col2: cassandra.TIMESTAMP,
  col3: cassandra.TEXT,
  cal4: cassandra.INT,
  // Primary Keys
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
  existing rows
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before1', col5: 0 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before2', col5: 1 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before3', col5: 2 }
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before4', col5: 3 }
    
*/

Model.create([{
  col1: uuid(),
  col2: now(),
  col3: toTimeStamp(now()),
  col4: 'test1',
  col5: 49
}, {
  col1: uuid(),
  col2: now(),
  col3: toTimeStamp(now()),
  col4: 'test2',
  col5: 23
}, {
  col1: uuid(),
  col2: now(),
  col3: toTimeStamp(now()),
  col4: 'test3',
  col5: 97
}, {
  col1: uuid(),
  col2: now(),
  col3: toTimeStamp(now()),
  col4: 'test4',
  col5: 57
}]).remove([{
  col1: 'generated uuid', // before2
  col2: 'generated timeuuid'
}, {
  col1: 'generated uuid', // before4
  col2: 'generated timeuuid'
}]).find().seam().subscribe(
  x => holder.push(x), 
  err => console.log(err), 
  () => console.log(holder[1])
);

/*
  holder[1].rows = [
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before1', col5: 0 },
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'before3', col5: 2 },
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test1', col5: 49 },
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test2', col5: 23 },
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test3', col5: 97 },
    { col1: '[uuid]', col2: '[timeuuid]', col3: '[created time]', col4: 'test4', col5: 57 }
  ]
*/
```
> Note: Cassmask on first model instance query will insert a table based off the model if the table does not exist => Holder index might be index+1

# Why Observables?

Observables are basically fancy promises but they operate under event streams which give us very interesting oportunities to filter and seam sets of queries. For more information about observables and the [ReactiveX](http://reactivex.io/) RxJS library [click here](http://reactivex.io/rxjs/).

## Every Query is a Observable.

In CassMask every query executes in an observable stream. The more queries you seam together the more Observables will be [concatonated](http://reactivex.io/documentation/operators/concat.html) together, creating the final seamed observable that will be subscribed to.

### Batching!

Batching is not always the best solution to minimize queries in Cassandra. Because of the nature of Cassandra and how it partitions the data to Nodes/SSTables, batching is best practice if and only if the INSERTS, UPDATES, and DELETES are for a single partition. 

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

### Things to consider before batching.

When batching, multiple queries are condenced into a single query with multiple statements. If you would like event driven features you will need to keep in mind that the CassMask Event API will only emit once per query response. Depending on your use case an emit per INSERT, UPDATE, and/or DELETE may be preferable.

## Event Hooks

In CassMask there are event hooks for 'save', 'update', 'remove', and 'find' that can be used to trigger a callback after a corresponding query. This callback is executed before the observer.next() and observer.complete() functions are called.

### Socket.io example

events.ts

```ts
import Model from './path/to/model.ts';

let EventEmitter = require('events').EventEmitter;
let ModelEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ModelEvents.setMaxListeners(0);

/* 
  You have access to the observer which next() and complete() function must be called inside the callback
    The lastEntity; for create(), update(), and remove(): json object that was originally passed into the query
      for find() and findOne(): the rows found in the table
    The client; this is the cassandra client, which can be used to execute additional queries
 */
Model.schema.post('save', function(observer, lastEntity, client) {
  // callback code goes here

  Model.Events.emit('save', lastEntity);

  observer.next(lastEntity);
  observer.complete();
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

    // the Emiter will listen for changes in the model
    ModelEvents.on(event, listener);
    // when a disconnect comes from the socket then remove the listener
    socket.on('disconnect', removeListener(event, listener));
  }
}

// create listener funtion
function createListener(event, socket) {
  return function(row) {
    // not sure
    socket.emit(event, row);
  };
}

// remove listener function
function removeListener(event, listener) {
  return function() {
    // in certain events come from the client, disconnect listener
    ModelEvents.removeListener(event, listener);
  };
}

export default modelRegister;
```

execute modelRegister(socket) in your socketio.config onConnect function

# Features

+ It uses the most up to date [Cassandra-Driver](https://github.com/datastax/nodejs-driver) from DataStax so all the features it has CassMask will have too. 
+ It creates a table based off the model if it does not already exist. 
+ It gives you all the tools availiable in CQL mapped in an easy to use api.
+ It allows you to seam together queries, using observables, garunteeing all queries are executed in the proper sequence.
+ It has an Events API that allow you to hook into query responses for event driven features

## Query Functions

#### [seam](https://github.com/JCThomas4214/CassMask/blob/master/libs/seam.ts)(): Rx.Observable\<any\>

#### [find](https://github.com/JCThomas4214/CassMask/blob/master/libs/find.ts)(items?: Object, opts?: Object): Schema

#### [findOne](https://github.com/JCThomas4214/CassMask/blob/master/libs/findOne.ts)(items?: Object, opts?: Object): Schema

#### [create](https://github.com/JCThomas4214/CassMask/blob/master/libs/create.ts)(items: [Object || Array\<Object\>], opts?: Object): Schema

#### [update](https://github.com/JCThomas4214/CassMask/blob/master/libs/update.ts)(object: [Object || Array\<Object\>], opts?: Object): Schema

#### [remove](https://github.com/JCThomas4214/CassMask/blob/master/libs/remove.ts)(object?: [Object || Array\<Object\>], opts?: Object): Schema

<a name="TODO"></a>

## TODO

+ Virtual fields and trigger functions
