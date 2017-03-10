import { Schema } from './schema';

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

export function parseModel(schema: any, obj: Schema): void {
  const keys = schema['keys'];

  let columns = [], // array for column names and data type
      colName = [], // array for column names only
      defaults = {};

  if (!schema['id']) {
    schema['id'] = {
      type: 'uuid',
      default: 'uuid()'
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

        columns.push(`${ x } ${ val.type }`); // push name and datatype to columns array
        colName.push(x); // push only column name to colName array
        if (val.default) 
          defaults[x] = val.default

      }
    }
  }
  // console.log(_.difference(colName, keys), keys);
  // console.log(objDiff(colName, keys), keys);
  // return schema object that will be used for query functions
  obj.columns = columns.join(', ');
  obj.keys = keys.join(', ');
  obj.allCol = colName,
  obj.columnList = objDiff(colName, keys);
  obj.keyList = keys;
  obj.defaults = defaults;
}