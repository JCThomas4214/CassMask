// post() is the event hook setting function
// pass in the hook event; 'save', 'remove', 'find'
// pass in a callback function that will be executed upon event
export function post(hook: string | Array<string>, fn: Function): void {
  if (!Array.isArray(hook)) {
    switch (hook) {
      case "create":
        this.schema['postcreate'] = fn;
        break;
      case "update":
        this.schema['postupdate'] = fn;
        break;
      case "find":
          this.schema['postfind'] = fn;
        break;
      case "remove":
          this.schema['postremove'] = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.schema['postcreate'] = fn;
          break;
        case "update":
          this.schema['postupdate'] = fn;
          break;
        case "find":
            this.schema['postfind'] = fn;
          break;
        case "remove":
            this.schema['postremove'] = fn;
          break;
      }
    }
  }
  return;
}
// pre() is the event hook setting function
// pass in the hook event; 'save', 'remove', 'find'
// pass in a callback function with a next callback as an argument
export function pre(hook: string | Array<string>, fn: Function): void {
  if (!Array.isArray(hook)) {
    switch (hook) {
      case "create":
        this.schema.precreate = fn;
        break;
      case "update":
        this.schema.preupdate = fn;
        break;
      case "find":
          this.schema.prefind = fn;
        break;
      case "remove":
          this.schema.preremove = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.schema.precreate = fn;
          break;
        case "update":
          this.schema.preupdate = fn;
          break;
        case "find":
            this.schema.prefind = fn;
          break;
        case "remove":
            this.schema.preremove = fn;
          break;
      }
    }
  }      
  return;
}