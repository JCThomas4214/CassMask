
[![npm version](https://img.shields.io/npm/v/cassmask.svg)](https://www.npmjs.com/package/cassmask)
[![Dependency Status](https://img.shields.io/david/JCThomas4214/CassMask.svg)](https://david-dm.org/JCThomas4214/CassMask.svg)

# CassMask

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
