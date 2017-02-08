"use strict";
var Rx = require("rxjs");
var immutable_1 = require("immutable");
var index_1 = require("../index");
/*
      PARSES ATTR INTO FINDS OBJECT TO THEN QUERY THE DB
 */
function find(object, opts) {
    var _this = this;
    var obs = this.createBatchQuery().push(Rx.Observable.create(function (observer) {
        var func = function () {
            var query = "SELECT * FROM " + _this.tableName + " WHERE";
            var params = [];
            if (object) {
                for (var x in object) {
                    query += " " + x + " = ? AND";
                    params.push(object[x]);
                }
                query = query.substring(0, query.length - 4);
            }
            if (params.length === 0)
                query = "SELECT * FROM " + _this.tableName;
            if (opts && opts.allowFiltering && params.length > 0)
                query += ' ALLOW FILTERING';
            return index_1.default.client.execute(query, params, { prepare: true });
        };
        func().then(function (entity) {
            observer.next(entity);
            observer.complete();
        }).catch(function (err) { return observer.error(err); });
        return function () { };
    }));
    return {
        tblChked: this.tblChked,
        model: this.model,
        auto: this.auto,
        tableName: this.tableName,
        obs: obs.concat([]),
        batchable: immutable_1.List([]),
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
exports.find = find;
