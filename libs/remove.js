"use strict";
var Rx = require("rxjs");
var immutable_1 = require("immutable");
var index_1 = require("../index");
/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */
function parseQueryDelete(items) {
    var _this = this;
    var q = [];
    for (var x = 0; x < items.length; x++) {
        q.push({ query: '', params: [] });
        var tmp = "DELETE FROM " + this.tableName + " WHERE";
        for (var y in items[x]) {
            tmp += " " + y + " = ? AND";
            q[x].params.push(items[x][y]);
        }
        q[x].query = tmp.substring(0, tmp.length - 4);
    }
    var batchable = this.batchable.concat(q);
    if (items.length === 0 || q[0].params.length === 0) {
        this.obs = this.checkTable().push(Rx.Observable.create(function (observer) {
            var func = function () {
                return index_1.default.client.execute("TRUNCATE " + _this.tableName);
            };
            func().then(function (entity) {
                observer.next(entity);
                observer.complete();
            }).catch(function (err) { return observer.error(err); });
            return function () { };
        }));
        batchable = immutable_1.List([]);
    }
    // console.log(batchable.toArray());
    return {
        tblChked: this.tblChked,
        model: this.model,
        auto: this.auto,
        tableName: this.tableName,
        obs: this.obs,
        batchable: batchable,
        createBatchQuery: this.createBatchQuery,
        parseQueryInsert: this.parseQueryInsert,
        parseQueryUpdate: this.parseQueryUpdate,
        parseQueryDelete: this.parseQueryDelete,
        seam: this.seam,
        remove: this.remove,
        create: this.create,
        find: this.find,
        findOne: this.findOne,
        update: this.update,
        checkTable: this.checkTable,
        createTable: this.createTable
    };
}
exports.parseQueryDelete = parseQueryDelete;
/*
    USES THE PARED OBJECT FROM FIND() OR FINDONE()
    AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
    EXECUTE FUNCTION

    REMOVE() IS FOR DELETING FOUND ROWS OR TRUNCATING TABLE
 */
function remove(object) {
    if (object === void 0) { object = {}; }
    return Array.isArray(object) ? this.parseQueryDelete(object) : this.parseQueryDelete([object]);
}
exports.remove = remove;
