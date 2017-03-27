import * as Rx from 'rxjs';
import {Model} from '../index';

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

export class Error {
  message: string = 'Error';
  name: string = 'Model Error';
  errors: any;

  constructor(error: any) {
    this.errors = error;
  }

}

export class SchemaHelper {
  columns: string;
  keys: string;
  allCol: Array<string>;
  columnList: Array<string>;
  keyList: Array<string>;
  defaults;
  require;
  indexes: Array<Array<string>> = [];

  tableName: string;
  tblChked: boolean = false;

  constructor(tableName: string, schema: Schema) {
    this.tableName = tableName;
    this.parseModel(schema);
    this.indexes.push(['id']);
  }

  createIndex(property: string | Array<string>): void {
    this.indexes.push(Array.isArray(property) ? property : [property]);
  }

  /*
      PARSES THE MODEL SENT INTO THE CONTRUCTOR
        WILL CREATE A KEY VALUE ARRAY TO USE IN
        LATER FUNCTIONS
   */

  parseModel(schema: Schema): void {
    const keys: Array<string> = schema['keys'];

    let columns = [], // array for column names and data type
        colName = [], // array for column names only
        require = {},
        defaults = {};

    // for every key in the schema JSON
    for (let x in schema) {
      const val = schema[x];
      // if key is not the PRIMARY KEYS, 'keys'
      if(typeof val !== 'function' && x !== 'keys' && x !== 'model') {

        if (typeof val === 'string') {

          columns.push(`${ x } ${ val }`); // push name and datatype to columns array
          colName.push(x); // push only column name to colName array

        } else {

          columns.push(`${ x } ${ val.type }`); // push name and datatype to columns array
          colName.push(x); // push only column name to colName array
          if (val.default)
            defaults[x] = val.default;
          if(val.required)
            require[x] = val.required;
          if (val.validate)
            schema['validate_' + x] = val.validate;

        }

      }
    }
    // return schema object that will be used for query functions
    this.columns = columns.join(', ');
    this.keys = keys.join(', ');
    this.allCol = colName;
    this.columnList = objDiff(colName, keys);
    this.keyList = keys;
    this.defaults = defaults;
    this.require = require;
  }

}

export class Schema {
  id = {
    type: 'uuid',
    default: 'uuid()'
  };

  model: Model;

  constructor(schema?: Schema | Object) {
    if (schema) {

      if(schema instanceof Schema) {
        for(let x in schema) {
          if (x !== 'methods' && x !== 'pre' &&
          x !== 'post' && x !== 'validate' &&
          typeof schema[x] === 'function')
            this[x] = schema[x];
        }
      }
      else {
        for(let x in schema) this[x] = schema[x];
      }

    }
  }

  methods(scope: Object): void {
    for (let x in scope) this[x] = scope[x];
  }

  validate(path: string, fn: Function): void {
    this['validate_' + path] = fn;
  }

  post(hook: string | Array<string>, fn: Function): void {
    if (!Array.isArray(hook)) hook = [hook];

    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this['post_create'] = fn;
          break;
        case "update":
          this['post_update'] = fn;
          break;
        case "find":
            this['post_find'] = fn;
          break;
        case "remove":
            this['post_remove'] = fn;
          break;
      }
    }
  }

  pre(hook: string | Array<string>, fn: Function): void {
    if (!Array.isArray(hook)) hook = [hook];

    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this['pre_create'] = fn;
          break;
        case "update":
          this['pre_update'] = fn;
          break;
        case "find":
            this['pre_find'] = fn;
          break;
        case "remove":
            this['pre_remove'] = fn;
          break;
      }
    }
  }

}
