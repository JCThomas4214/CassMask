"use strict";
var Rx = require("rxjs");
var index_1 = require("../index");
/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */
function createTable() {
    var _this = this;
    return this.obs.push(Rx.Observable.create(function (observer) {
        var func = function () {
            var query = "CREATE TABLE IF NOT EXISTS " + _this.tableName + " (" + _this.model.columns + ", PRIMARY KEY (" + _this.model.keys + "))";
            return index_1.default.client.execute(query);
        };
        func().then(function (entity) {
            observer.next(entity);
            observer.complete();
        }).catch(function (err) { return observer.error(err); });
        return function () { };
    }));
}
exports.createTable = createTable;
function checkTable() {
    if (!this.tblChked) {
        this.tblChked = true;
        return this.createTable();
    }
    return this.obs;
}
exports.checkTable = checkTable;
