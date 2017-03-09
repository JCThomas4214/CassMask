'use strict';

// post() is the event hook setting function
// pass in the hook event; 'save', 'remove', 'find'
// pass in a callback function that will be executed upon event
export function post(hook: string | Array<string>, fn: Function): void {
  if (!Array.isArray(hook)) {
    switch (hook) {
      case "create":
        this.helper.post.create = fn;
        break;
      case "update":
        this.helper.post.update = fn;
        break;
      case "find":
          this.helper.post.find = fn;
        break;
      case "remove":
          this.helper.post.remove = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.helper.post.create = fn;
          break;
        case "update":
          this.helper.post.update = fn;
          break;
        case "find":
            this.helper.post.find = fn;
          break;
        case "remove":
            this.helper.post.remove = fn;
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
        this.helper.pre.create = fn;
        break;
      case "update":
        this.helper.pre.update = fn;
        break;
      case "find":
          this.helper.pre.find = fn;
        break;
      case "remove":
          this.helper.pre.remove = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.helper.pre.create = fn;
          break;
        case "update":
          this.helper.pre.update = fn;
          break;
        case "find":
            this.helper.pre.find = fn;
          break;
        case "remove":
            this.helper.pre.remove = fn;
          break;
      }
    }
  }      
  return;
}