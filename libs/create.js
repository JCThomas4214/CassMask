"use strict";
var index_1 = require("../index");
/*
    PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
      THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
 */
function parseQueryInsert(items) {
    var q = [];
    for (var x = 0; x < items.length; x++) {
        q.push({ query: '', params: [] });
        var tmp1 = "INSERT INTO " + this.tableName + " (";
        var tmp2 = ") VALUES (";
        for (var y in items[x]) {
            if (items[x][y] !== index_1.default.TIMEUUID &&
                items[x][y] !== index_1.default.UUID &&
                items[x][y] !== index_1.default.TIMESTAMP) {
                tmp1 += y + ", ";
                tmp2 += "?, ";
                q[x].params.push(items[x][y]);
            }
        }
        tmp1 = this.auto.cols.length ? tmp1 + this.auto.cols.join(', ') : tmp1.substring(0, tmp1.length - 2);
        tmp2 = this.auto.vals.length ? tmp2 + this.auto.vals.join(', ') + ')' : tmp2.substring(0, tmp2.length - 2) + ')';
        q[x].query = tmp1 + tmp2;
    }
    // console.log(this.batchable.concat(q).toArray());
    return {
        tblChked: this.tblChked,
        model: this.model,
        auto: this.auto,
        tableName: this.tableName,
        obs: this.obs,
        batchable: this.batchable.concat(q),
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
exports.parseQueryInsert = parseQueryInsert;
/*
      CREATE A NEW ROW IN THE INSTANCE TABLE
        USES CASS DRIVER BATCH FUNCTION TO INSERT PARSED OBJECT ARRAY
 */
function create(items) {
    return Array.isArray(items) ? this.parseQueryInsert(items) : this.parseQueryInsert([items]);
}
exports.create = create;
