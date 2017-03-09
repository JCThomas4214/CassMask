'use strict';

// post() is the event hook setting function
// pass in the hook event; 'save', 'remove', 'find'
// pass in a callback function that will be executed upon event
export function post(hook: string | Array<string>, fn: Function): void {
  if (!Array.isArray(hook)) {
    switch (hook) {
      case "create":
        this.helper.postcreate = fn;
        break;
      case "update":
        this.helper.postupdate = fn;
        break;
      case "find":
          this.helper.postfind = fn;
        break;
      case "remove":
          this.helper.postremove = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.helper.postcreate = fn;
          break;
        case "update":
          this.helper.postupdate = fn;
          break;
        case "find":
            this.helper.postfind = fn;
          break;
        case "remove":
            this.helper.postremove = fn;
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
        this.helper.precreate = fn;
        break;
      case "update":
        this.helper.preupdate = fn;
        break;
      case "find":
          this.helper.prefind = fn;
        break;
      case "remove":
          this.helper.preremove = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.helper.precreate = fn;
          break;
        case "update":
          this.helper.preupdate = fn;
          break;
        case "find":
            this.helper.prefind = fn;
          break;
        case "remove":
            this.helper.preremove = fn;
          break;
      }
    }
  }      
  return;
}