
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

export interface MapAction {
  action: string,
  index?: any,
  payload?: any
}

export interface ListAction {
  action: string,
  index?: any,
  payload?: any
}

export interface SetAction {
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
  export function append(keyVal: Object): MapAction {
    return {
      action: 'append',
      payload: `+ ${keyVal}`
    }
  }
  export function set(set: any, val: any): MapAction {
    return {
      action: 'set',
      index: `[${set}]`,
      payload: val
    }
  }
  export function reset(keyVal: Object): MapAction {
    return {
      action: 'reset',
      payload: keyVal
    }
  }
  export function remove(keys: Array<string>): MapAction {
    return {
      action: 'remove',
      payload: `- { ${keys.join(', ')} }`
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
  export function append(keyVal: Object): ListAction {
    return {
      action: 'append',
      payload: `+ ${keyVal}`
    }
  }
  export function prepend(keyVal: Object): ListAction {
    return {
      action: 'prepend',
      payload: `${keyVal} +`
    }
  }
  export function set(set: any, val: any): ListAction {
    return {
      action: 'set',
      index: `[${set}]`,
      payload: val
    }
  }
  export function reset(keyVal: Object): ListAction {
    return {
      action: 'reset',
      payload: keyVal
    }
  }
  export function remove(keys: number | string): ListAction {
    return {
      action: 'remove',
      index: `[${keys}]`
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
  export function append(keyVal: Object): SetAction {
    return {
      action: 'append',
      payload: `+ ${keyVal}`
    }
  }
  export function prepend(keyVal: Object): SetAction {
    return {
      action: 'prepend',
      payload: `${keyVal} +`
    }
  }
  export function set(set: any, val: any): SetAction {
    return {
      action: 'set',
      index: `[${set}]`,
      payload: val
    }
  }
  export function reset(keyVal: Object): SetAction {
    return {
      action: 'reset',
      payload: keyVal
    }
  }
  export function remove(keys: number | string): SetAction {
    return {
      action: 'remove',
      index: `[${keys}]`
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