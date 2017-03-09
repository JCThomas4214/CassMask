'use strict';

export interface eventFunctions {
  create: Function;
  update: Function;
  remove: Function;
  find: Function;
}

class Eve implements eventFunctions {
  create;
  update;
  remove;
  find;
}

export class Helper {
  public pre: eventFunctions = new Eve();
  public post: eventFunctions = new Eve();

  public methods: any = {};

  constructor() {

  }

}