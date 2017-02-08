"use strict";
var Rx = require("rxjs");
var index_1 = require("../index");
/*
    CREATES A QUERY FROM THE CURRENT BATCHABLE LIST
      AND RETURNS TH NEW CONCATONATED OBSERVABLE LIST
 */
function createBatchQuery() {
    var _this = this;
    switch (this.batchable.size) {
        case 0:
            return this.checkTable();
        case 1:
            return this.checkTable().push(Rx.Observable.create(function (observer) {
                var func = function () {
                    return index_1.default.client.execute(_this.batchable.get(0).query, _this.batchable.get(0).params, { prepare: true });
                };
                func().then(function (entity) {
                    observer.next(entity);
                    observer.complete();
                }).catch(function (err) { return observer.error(err); });
                return function () { };
            }));
        default:
            return this.checkTable().push(Rx.Observable.create(function (observer) {
                var func = function () {
                    return index_1.default.client.batch(_this.batchable.toArray(), { prepare: true });
                };
                func().then(function (entity) {
                    observer.next(entity);
                    observer.complete();
                }).catch(function (err) { return observer.error(err); });
                return function () { };
            }));
    }
}
exports.createBatchQuery = createBatchQuery;
