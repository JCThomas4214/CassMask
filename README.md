
[![npm version](https://img.shields.io/npm/v/cassmask.svg)](https://www.npmjs.com/package/cassmask)

# CassMask

This ORM is a work in progress and is not suggested for production as core features have not yet been implimented. Contributors are welcome to Fork and pull request. Visit the [TODO](#TODO) section for what needs to be done. 

## Quick Start

```sh
$ npm install cassmask rxjs immmutable cassandra-driver
```

Connect to Cassandra with a [ClientOptions](http://docs.datastax.com/en/developer/nodejs-driver/3.2/api/type.ClientOptions/) object.

```ts
import cassandra from 'cassmask';

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
import cassandra from 'cassmask';

let Model = new cassandra.Schema('TableName', {
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
  col3: 'test1',
  col4: 49
}, {
  col3: 'test2',
  col4: 23
}, {
  col3: 'test3',
  col4: 97
}, {
  col3: 'test4',
  col4: 57
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
> Note: UUID, TIMEUUID, and TIMESTAMP is auto generated on INSERT queries. Cassmask on first model instance query will insert a table based off the model if the table does not exist => Holder index might be index+1

## Why Observables?

Observables are basically fancy promises but they operate under event streams which give us very interesting oportunities to filter and seam sets of queries. For more information about observables and the [ReactiveX](http://reactivex.io/) RxJS library [click here](http://reactivex.io/rxjs/).

## Every Query is a Observable.

In CassMask every query executes in an observable stream. The more queries you seam together the more Observables will be [concatonated](http://reactivex.io/documentation/operators/concat.html) together, creating the final seamed observable that will be subscribed to.

## Batching is Important!

Batching not only reduces the amount of queries to the database but it also ensures atomicity, if one statement fails they all fail. You can read more about batching and it's importance [click here](https://docs.datastax.com/en/cql/3.3/cql/cql_using/useBatch.html).

CassMask batches as much as possible. If all of your queries are batchable then there will only be one query (one observable) to the database. If in the middle of your statements you throw in a non-batchable query CassMask will act appropriately and batch as much in the beginning to create one query, create another query for the non-batchable, and batch as much for the rest before seaming all the observables together for the stream.

# Features

+ It uses the most up to date [Cassandra-Driver](https://github.com/datastax/nodejs-driver) from DataStax so all the features it has CassMask will have too. 
+ It creates a table based off the model if it does not already exist. 
+ It gives you all the tools availiable in CQL mapped in an easy to use api.
+ It allows you to seam together queries, using observables, garunteeing all queries are executed in the proper sequence.
+ It minimizes the amount of queries as much as possible with batching while maintaining proper sequence.

## Query Functions

#### [seam](https://github.com/JCThomas4214/CassMask/blob/master/libs/seam.ts)(): Rx.Observable\<any\>

#### [find](https://github.com/JCThomas4214/CassMask/blob/master/libs/find.ts)(items?: Object, opts?: Object): Schema

#### [findOne](https://github.com/JCThomas4214/CassMask/blob/master/libs/findOne.ts)(items?: Object, opts?: Object): Schema

#### [create](https://github.com/JCThomas4214/CassMask/blob/master/libs/create.ts)(items: [Object || Array\<Object\>]): Schema

#### [update](https://github.com/JCThomas4214/CassMask/blob/master/libs/update.ts)(object: [Object || Array\<Object\>], change?: Object): Schema

#### [remove](https://github.com/JCThomas4214/CassMask/blob/master/libs/remove.ts)(object: [Object || Array\<Object\>] = {}): Schema

<a name="TODO"></a>
## TODO

+ EventEmitter API (using Cassandra-driver events || Observable streams) to allow for event driven features like Socket.io
+ Virtual fields and trigger functions
