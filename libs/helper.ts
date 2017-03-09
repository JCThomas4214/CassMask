
export class Helper {

  public precreate: Function;
  public preupdate: Function;
  public preremove: Function;
  public prefind: Function;

  public postcreate: Function;
  public postupdate: Function;
  public postremove: Function;
  public postfind: Function;

  constructor(helper?: Helper) {
    if(helper) for(let x in helper) this[x] = helper[x];
  }

}