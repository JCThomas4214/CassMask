'use strict';

// post() is the event hook setting function
// pass in the hook event; 'save', 'remove', 'find'
// pass in a callback function that will be executed upon event
export function post(hook: string | Array<string>, fn: Function): void {
  if (!Array.isArray(hook)) {
    switch (hook) {
      case "create":
        this.helper.postCreateCb = fn;
        break;
      case "update":
        this.helper.postUpdateCb = fn;
        break;
      case "find":
          this.helper.postFindCb = fn;
        break;
      case "remove":
          this.helper.postRemoveCb = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.helper.postCreateCb = fn;
          break;
        case "update":
          this.helper.postUpdateCb = fn;
          break;
        case "find":
            this.helper.postFindCb = fn;
          break;
        case "remove":
            this.helper.postRemoveCb = fn;
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
        this.helper.preCreateCb = fn;
        break;
      case "update":
        this.helper.preUpdateCb = fn;
        break;
      case "find":
          this.helper.preFindCb = fn;
        break;
      case "remove":
          this.helper.preRemoveCb = fn;
        break;
    }
  } else {
    for (let x = 0; x < hook.length; x++) {
      switch (hook[x]) {
        case "create":
          this.helper.preCreateCb = fn;
          break;
        case "update":
          this.helper.preUpdateCb = fn;
          break;
        case "find":
            this.helper.preFindCb = fn;
          break;
        case "remove":
            this.helper.preRemoveCb = fn;
          break;
      }
    }
  }      
  return;
}