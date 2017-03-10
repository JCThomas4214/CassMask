// post() is the event hook setting function
// pass in the hook event; 'save', 'remove', 'find'
// pass in a callback function that will be executed upon event
export function post(hook: string | Array<string>, fn: Function): void {
  if (!Array.isArray(hook)) {
    switch (hook) {
      case "create":
        this.schema['post_create'] = fn;
        break;
      case "update":
        this.schema['post_update'] = fn;
        break;
      case "find":
          this.schema['post_find'] = fn;
        break;
      case "remove":
          this.schema['post_remove'] = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.schema['post_create'] = fn;
          break;
        case "update":
          this.schema['post_update'] = fn;
          break;
        case "find":
            this.schema['post_find'] = fn;
          break;
        case "remove":
            this.schema['post_remove'] = fn;
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
        this.schema['pre_create'] = fn;
        break;
      case "update":
        this.schema['pre_update'] = fn;
        break;
      case "find":
          this.schema['pre_find'] = fn;
        break;
      case "remove":
          this.schema['pre_remove'] = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.schema['pre_create'] = fn;
          break;
        case "update":
          this.schema['pre_update'] = fn;
          break;
        case "find":
            this.schema['pre_find'] = fn;
          break;
        case "remove":
            this.schema['pre_remove'] = fn;
          break;
      }
    }
  }      
  return;
}