
// replica functions for database query functions
export function now() {
  return 'now()';
}
export function uuid() {
  return 'uuid()';
}
export function toTimeStamp(timeuuid: string) {
  return `toTimeStamp(${timeuuid})`;
}

export interface CollectionAction {
  type: string,
  action: string,
  index?: any,
  payload?: any
}

export function MAP(keyType: string, valType: string): string {
  return MAP.schemaString(keyType, valType);
}

export namespace MAP {
  export function schemaString(keyType: string, valType: string): string {
    return `map<${keyType},${valType}>`;
  }
  export function append(keyVal: Object): CollectionAction {
    return {
      type: 'MAP',
      action: 'append',
      payload: keyVal
    }
  }
  export function set(set: any, val: any): CollectionAction {
    return {
      type: 'MAP',
      action: 'set',
      index: set,
      payload: val
    }
  }
  export function reset(keyVal: Object): CollectionAction {
    return {
      type: 'MAP',
      action: 'reset',
      payload: keyVal
    }
  }
  export function remove(keys: Array<string>): CollectionAction {
    return {
      type: 'MAP',
      action: 'remove',
      payload: keys
    }
  }
}

export function LIST(valType: string): string {
  return LIST.schemaString(valType);
}

export namespace LIST {
  export function schemaString(valType: string): string {
    return `list<${valType}>`;
  }
  export function append(keyVal: Array<any>): CollectionAction {
    return {
      type: 'LIST',
      action: 'append',
      payload: keyVal
    }
  }
  export function prepend(keyVal: Array<any>): CollectionAction {
    return {
      type: 'LIST',
      action: 'prepend',
      payload: keyVal
    }
  }
  export function set(set: number, val: any): CollectionAction {
    return {
      type: 'LIST',
      action: 'set',
      index: set,
      payload: val
    }
  }
  export function reset(keyVal: Object): CollectionAction {
    return {
      type: 'LIST',
      action: 'reset',
      payload: keyVal
    }
  }
  export function remove(keys: number | Array<number>): CollectionAction {
    return {
      type: 'LIST',
      action: 'removeOne',
      index: keys
    }
  }
}

export function SET(valType: string): string {
  return SET.schemaString(valType);
}

export namespace SET {
  export function schemaString(valType: string): string {
    return `set<${valType}>`;
  }
  export function append(keyVal: Object): CollectionAction {
    return {
      type: 'SET',
      action: 'append',
      payload: keyVal
    }
  }
  export function set(set: number, val: any): CollectionAction {
    return {
      type: 'SET',
      action: 'set',
      index: set,
      payload: val
    }
  }
  export function reset(keyVal: Object): CollectionAction {
    return {
      type: 'SET',
      action: 'reset',
      payload: keyVal
    }
  }
  export function remove(keys: number | Array<number>): CollectionAction {
    return {
      type: 'SET',
      action: 'remove',
      index: keys
    }
  }
}

export declare type MAP = Object;
export declare type LIST = Array<any>;
export declare type SET = Object;

export declare type BLOB = string;
export declare type ASCII = string;
export declare type TEXT = string;
export declare type VARCHAR = string;
export declare type BOOLEAN = string;
export declare type DOUBLE = string;
export declare type FLOAT = string;
export declare type BIGINT = string;
export declare type INT = string;
export declare type SMALLINT = string;
export declare type TINYINT = string;
export declare type VARINT = string;
export declare type UUID = string;
export declare type TIMEUUID = string;
export declare type DATE = string;
export declare type TIME = string;
export declare type TIMESTAMP = string;
export declare type INET = string;
export declare type COUNTER = string;

export const BLOB: string = 'blob';
export const ASCII: string = 'ascii';
export const TEXT: string = 'text';
export const VARCHAR: string = 'varchar';
export const BOOLEAN: string = 'boolean';
export const DOUBLE: string = 'double';
export const FLOAT: string = 'float';
export const BIGINT: string = 'bigint';
export const INT: string = 'int';
export const SMALLINT: string = 'smallint';
export const TINYINT: string = 'tinyint';
export const VARINT: string = 'varint';
export const UUID: string = 'uuid';
export const TIMEUUID: string = 'timeuuid';
export const DATE: string = 'date';
export const TIME: string = 'time';
export const TIMESTAMP: string = 'timestamp';
export const INET: string = 'inet';
export const COUNTER: string = 'counter';