'use strict';

export class Helper {
  private preCreateCb: Function;
  private preUpdateCb: Function;
  private preRemoveCb: Function;
  private preFindCb: Function;
  private postCreateCb: Function;
  private postUpdateCb: Function;
  private postRemoveCb: Function;
  private postFindCb: Function;

  constructor() {

  }

  methods(scope: Object): void {
    for (let x in scope) this[x] = scope[x];
  }
}