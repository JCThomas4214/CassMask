'use strict';

// Returns the set difference of the first source array to the second
export function objDiff(object: Array<string>, source: Array<string>) {
  let dest = [];
  for (let x = 0; x < object.length; x++) {
    const objVal = object[x];
    for (let y = 0; y < source.length; y++) {
      if (objVal === source[y]) break;
      if (y === source.length - 1) dest.push(objVal);
    }
  }
  return dest;
}

/*
    PARSES THE MODEL SENT INTO THE CONTRUCTOR
      WILL CREATE A KEY VALUE ARRAY TO USE IN 
      LATER FUNCTIONS
 */

export function parseModel(schema: any): any {
  const keys = schema['keys'];

  let columns = [], // array for column names and data type
      colName = [], // array for column names only
      defaults = {};

  if (!schema['id']) {
    schema['id'] = {
      Type: 'uuid',
      Default: 'uuid()'
    };
  }
  // for every key in the schema JSON
  for (let x in schema) { 
    const val = schema[x];

    if (x !== 'keys') { // if key is not the PRIMARY KEYS, 'keys'
      if (typeof val === 'string') {

        columns.push(`${ x } ${ val }`); // push name and datatype to columns array
        colName.push(x); // push only column name to colName array

      } else if (typeof val === 'object') {

        columns.push(`${ x } ${ val.Type }`); // push name and datatype to columns array
        colName.push(x); // push only column name to colName array
        if (val.Default) 
          defaults[x] = val.Default

      }
    }
  }
  // console.log(_.difference(colName, keys), keys);
  // console.log(objDiff(colName, keys), keys);
  // return schema object that will be used for query functions
  return {
    columns: columns.join(', '),
    keys: keys.join(', '),
    allCol: colName,
    columnList: objDiff(colName, keys),
    keyList: keys,
    defaults: defaults
  };
}