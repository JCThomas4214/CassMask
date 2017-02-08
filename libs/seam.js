"use strict";
var Rx = require("rxjs");
/*
     USES THE PARSED OBJECT FROM FIND() OR FINDONE()
     AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
     EXECUTE FUNCTION

     SEAM() IS USED FOR FINDS ONLY
 */
function seam() {
    var obs = this.createBatchQuery();
    return obs.size > 1 ? Rx.Observable.concat.apply(this, obs.toArray()) : obs.first();
}
exports.seam = seam;
