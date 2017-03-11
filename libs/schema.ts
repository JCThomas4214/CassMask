
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

export class SchemaHelper {
  columns: string;
  keys: string;
  allCol: Array<string>;
  columnList: Array<string>;
  keyList: Array<string>;
  defaults;

  tableName: string;
  tblChked: boolean = false;

  constructor(tableName: string, schema: Schema) {
    this.tableName = tableName;
    this.parseModel(schema);
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
      // if key is not the PRIMARY KEYS, 'keys'
      if(typeof val !== 'function' && x !== 'keys') {

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
    // return schema object that will be used for query functions
    this.columns = columns.join(', ');
    this.keys = keys.join(', ');
    this.allCol = colName,
    this.columnList = objDiff(colName, keys);
    this.keyList = keys;
    this.defaults = defaults;
  }
}

export class Schema {

  constructor(schema?: Schema | Object) {
    if(schema && schema instanceof Schema)
      for(let x in schema) {
        if (typeof schema[x] === 'function')
          this[x] = schema[x]
      }
    else for(let x in schema) this[x] = schema[x];      
  }

}