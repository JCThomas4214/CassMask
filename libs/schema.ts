import { parseModel } from './parseModel';


export class Schema {
  columns: string;
  keys: string;
  allCol: Array<string>;
  columnList: Array<string>;
  keyList: Array<string>;
  defaults;

  tableName: string;
  tblChked: boolean = false;

  constructor(schema?: Schema | Object) {
    if(schema && schema instanceof Schema) for(let x in schema) this[x] = schema[x];
    else parseModel(schema, this);
  }

}