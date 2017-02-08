"use strict";
var cass = require('cassandra-driver');
var Rx = require("rxjs");
var immutable_1 = require("immutable");
var libs_1 = require("./libs");
var cassandra = (function () {
    function cassandra() {
    }
    // Connect function is used to connect to Cassandra
    // and store the client object 
    cassandra.connect = function (config, cb) {
        cassandra.client = new cass.Client(config);
        cassandra.client.connect(function (err, result) {
            if (err) {
                console.error('Could not connect to CassandraDB!');
                console.log(err);
            }
            // let test = cassandra.client.HostMap();
            // console.log(cassandra.client);
            // console.log(cassandra.client.host);
            return cb ? cb(err, result) : null;
        });
    };
    return cassandra;
}());
// Cassandra data types
cassandra.TEXT = 'text';
cassandra.INT = 'int';
cassandra.UUID = 'uuid';
cassandra.TIMEUUID = 'timeuuid';
cassandra.TIMESTAMP = 'timestamp';
cassandra.Schema = (function () {
    function class_1(modelName, model, options) {
        this.tblChked = false;
        this.obs = immutable_1.List([]);
        this.batchable = immutable_1.List([]);
        this.auto = { cols: [], vals: [] };
        // Default Options
        this.options = {};
        this.parseQueryInsert = libs_1.parseQueryInsert;
        this.create = libs_1.create;
        this.find = libs_1.find;
        this.findOne = libs_1.findOne;
        this.model = this.parseModel(model);
        this.tableName = modelName;
        this.options = this.options || options;
    }
    /*
        PARSES THE MODEL SENT INTO THE CONTRUCTOR
          WILL CREATE A KEY VALUE ARRAY TO USE IN
          LATER FUNCTIONS
     */
    class_1.prototype.parseModel = function (model) {
        var columns = [];
        for (var x in model) {
            if (x !== 'keys') {
                columns.push(x + " " + model[x]);
                if (model[x] === cassandra.TIMEUUID) {
                    this.auto.cols.push(x);
                    this.auto.vals.push('now()');
                }
                else if (model[x] === cassandra.UUID) {
                    this.auto.cols.push(x);
                    this.auto.vals.push('uuid()');
                }
                else if (model[x] === cassandra.TIMESTAMP) {
                    this.auto.cols.push(x);
                    this.auto.vals.push('toTimeStamp(now())');
                }
            }
        }
        return {
            columns: columns.join(', '),
            keys: model['keys'].join(', ')
        };
    };
    /*
        PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
          THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
     */
    class_1.prototype.parseQueryUpdate = function (items) {
        var q = [];
        for (var x = 0; x < items.length; x++) {
            q.push({ query: '', params: [] });
            var tmp = "UPDATE " + this.tableName + " SET";
            for (var y in items[x].set) {
                tmp += " " + y + " = ?, ";
                q[x].params.push(items[x].set[y]);
            }
            tmp = tmp.substring(0, tmp.length - 2);
            tmp += ' WHERE';
            for (var z in items[x].in) {
                tmp += " " + z + " = ? AND";
                q[x].params.push(items[x].in[z]);
            }
            tmp = tmp.substring(0, tmp.length - 4);
            tmp += ' IF EXISTS';
            q[x].query = tmp;
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
    };
    /*
        PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
          THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
     */
    class_1.prototype.parseQueryDelete = function (items) {
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
                    return cassandra.client.execute("TRUNCATE " + _this.tableName);
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
    };
    /*
        CREATES A QUERY FROM THE CURRENT BATCHABLE LIST
          AND RETURNS TH NEW CONCATONATED OBSERVABLE LIST
     */
    class_1.prototype.createBatchQuery = function () {
        var _this = this;
        switch (this.batchable.size) {
            case 0:
                return this.checkTable();
            case 1:
                return this.checkTable().push(Rx.Observable.create(function (observer) {
                    var func = function () {
                        return cassandra.client.execute(_this.batchable.get(0).query, _this.batchable.get(0).params, { prepare: true });
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
                        return cassandra.client.batch(_this.batchable.toArray(), { prepare: true });
                    };
                    func().then(function (entity) {
                        observer.next(entity);
                        observer.complete();
                    }).catch(function (err) { return observer.error(err); });
                    return function () { };
                }));
        }
    };
    /*
        PARSES THE INPUTTED OBJECT ARRAY INTO A SEPARATE ARRAYS
          THEN CREATED THE BATCH QUERY ARRAY FOR CASS DRIVER
     */
    class_1.prototype.createTable = function () {
        var _this = this;
        return this.obs.push(Rx.Observable.create(function (observer) {
            var func = function () {
                var query = "CREATE TABLE IF NOT EXISTS " + _this.tableName + " (" + _this.model.columns + ", PRIMARY KEY (" + _this.model.keys + "))";
                return cassandra.client.execute(query);
            };
            func().then(function (entity) {
                observer.next(entity);
                observer.complete();
            }).catch(function (err) { return observer.error(err); });
            return function () { };
        }));
    };
    class_1.prototype.checkTable = function () {
        if (!this.tblChked) {
            this.tblChked = true;
            return this.createTable();
        }
        return this.obs;
    };
    /*
        USES THE PARSED OBJECT FROM FIND() OR FINDONE()
        AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
        EXECUTE FUNCTION

        UPDATE() IS USED FOR UPDATING EXISTING ROW(S)
        IN THE TABLE
     */
    class_1.prototype.update = function (object, change) {
        return Array.isArray(object) ? this.parseQueryUpdate(object) : this.parseQueryUpdate([{ set: object, in: change }]);
    };
    /*
        USES THE PARED OBJECT FROM FIND() OR FINDONE()
        AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
        EXECUTE FUNCTION

        REMOVE() IS FOR DELETING FOUND ROWS OR TRUNCATING TABLE
     */
    class_1.prototype.remove = function (object) {
        if (object === void 0) { object = {}; }
        return Array.isArray(object) ? this.parseQueryDelete(object) : this.parseQueryDelete([object]);
    };
    /*
         USES THE PARSED OBJECT FROM FIND() OR FINDONE()
         AND CREATES THE QUERY STRING TO USE CASS DRIVER'S
         EXECUTE FUNCTION

         SEAM() IS USED FOR FINDS ONLY
     */
    class_1.prototype.seam = function () {
        var obs = this.createBatchQuery();
        return obs.size > 1 ? Rx.Observable.concat.apply(this, obs.toArray()) : obs.first();
    };
    return class_1;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cassandra;
