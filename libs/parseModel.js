"use strict";
var index_1 = require("../index");
/*
    PARSES THE MODEL SENT INTO THE CONTRUCTOR
      WILL CREATE A KEY VALUE ARRAY TO USE IN
      LATER FUNCTIONS
 */
function parseModel(model) {
    var columns = [];
    for (var x in model) {
        if (x !== 'keys') {
            columns.push(x + " " + model[x]);
            if (model[x] === index_1.default.TIMEUUID) {
                this.auto.cols.push(x);
                this.auto.vals.push('now()');
            }
            else if (model[x] === index_1.default.UUID) {
                this.auto.cols.push(x);
                this.auto.vals.push('uuid()');
            }
            else if (model[x] === index_1.default.TIMESTAMP) {
                this.auto.cols.push(x);
                this.auto.vals.push('toTimeStamp(now())');
            }
        }
    }
    return {
        columns: columns.join(', '),
        keys: model['keys'].join(', ')
    };
}
exports.parseModel = parseModel;
