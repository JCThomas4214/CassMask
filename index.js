!function(e){e.$fuse$=e,e.pkg("cassmask",{},function(e){return e.file("src/index.js",function(e,t,r,n,i){"use strict";function o(t,r){e.client=new s.Client(t),e.client.connect(function(e,t){return e&&(console.error("Could not connect to CassandraDB!"),console.log(e)),r?r(e,t):null})}function a(e,t,r){var n=new c.SchemaHelper(e+"s",t);if(r)for(var i=0;i<r.length;i++)n.createIndex(r[i]);return new l(e+"s",t,n)}Object.defineProperty(e,"__esModule",{value:!0});var s=t("cassandra-driver"),u=t("rxjs"),c=t("./libs");e.Schema=c.Schema,e.Entity=c.Entity,e.connect=o,e.model=a;var l=function(){function t(e,r,n,i){e instanceof t?(this.obs=r,this.schema=e.schema,this.schemaHelper=e.schemaHelper,this.options=e.options):(this.obs=u.Observable.empty(),this.schema=r,this.schemaHelper=n,i&&(this.options=i))}return t.prototype.remove=function(r,n){var i=this,o=u.Observable.concat(this.obs);if(r){Array.isArray(r)||(r=[r]);for(var a=[],s=[],l=this,p=0;p<r.length;p++)!function(e){var t=new c.Entity(r[e],l);t.pre_remove&&a.push(u.Observable.create(function(e){t.pre_remove(function(){e.next(),e.complete()},function(t){return e.error(t)},t)})),s.push(c.executeQueryDelete(t,n))}(p);if(this.schema.pre_remove){var f=a.length>1?u.Observable.merge.apply(this,a):a[0];o=o.concat(f)}o=o.concat.apply(o,s)}else o=o.concat(u.Observable.create(function(t){return e.client.execute("TRUNCATE "+i.schemaHelper.tableName).then(function(e){t.next(),t.complete()}).catch(function(e){return t.error(e)}),function(){}}));return new t(this,o)},t.prototype.update=function(e,r){var n=u.Observable.concat(this.obs);e=Array.isArray(e)?e:[e];for(var i=[],o=[],a=[],s=this,l=0;l<e.length;l++)!function(t){var n=e[t],l=new c.Entity(n.set,s,{validateChk:!0});l.merge(n.where),l.validationObs&&i.push(l.validationObs),l.pre_update&&o.push(u.Observable.create(function(e){l.pre_update(function(){e.next(),e.complete()},function(t){return e.error(t)},l)})),a.push(c.executeQueryUpdate(l,r||{}))}(l);return i.length>0&&(n=n.concat(i.length>1?u.Observable.merge.apply(this,i):i[0])),this.schema.pre_update&&(n=n.concat(o.length>1?u.Observable.merge.apply(this,o):o[0])),new t(this,n.concat.apply(n,a))},t.prototype.create=function(e,r){var n=this.obs?u.Observable.concat(this.obs):null;e=Array.isArray(e)?e:[e];for(var i=[],o=[],a=[],s=[],l=(this.schemaHelper.defaults,this),p=0;p<e.length;p++)!function(t){var n=e[t];n=new c.Entity(n,l,{validateChk:!0,requireChk:!0,useDefaults:!0}),n.requireObs&&o.push(n.requireObs),n.validationObs&&i.push(n.validationObs),n.pre_create&&a.push(u.Observable.create(function(e){n.pre_create(function(){e.next(),e.complete()},function(t){return e.error(t)},n)})),s.push(c.executeQueryInsert(n,r))}(p);return o.length>0&&(n=n.concat(o.length>1?u.Observable.merge.apply(this,o):o[0])),i.length>0&&(n=n.concat(i.length>1?u.Observable.merge.apply(this,i):i[0])),this.schema.pre_create&&(n=n.concat(a.length>1?u.Observable.merge.apply(this,a):a[0])),new t(this,n.concat.apply(n,s))},t.prototype.find=function(e,r){var n=u.Observable.concat(this.obs),i=new c.Entity(e||{},this);return i.pre_find&&(n=n.concat(u.Observable.create(function(e){i.pre_find(function(){e.next(),e.complete()},function(t){return e.error(t)},i)}))),n=n.concat(c.executeQuerySelect(i,r)),new t(this,n)},t.prototype.findOne=function(e,t){return t||(t={}),t.limit=1,this.find(e,t)},t.prototype.findById=function(e,t){return this.find({id:e},t)},t.prototype.seam=function(){return c.checkTable(this.obs,this.schemaHelper).filter(function(e){return e})},t.prototype.post=function(e,t){return this.schema.post(e,t)},t.prototype.pre=function(e,t){return this.schema.pre(e,t)},t.prototype.methods=function(e){return this.schema.methods(e)},t.prototype.validate=function(e,t){return this.schema.validate(e,t)},t.prototype.createIndex=function(e){this.schemaHelper.createIndex(e)},t.prototype.insertJsonBatch=function(t,r){var n=this;return u.Observable.create(function(r){for(var i=[],o=0;o<t.length;o++)i.push({query:"INSERT INTO "+n.schemaHelper.tableName+" JSON '"+JSON.stringify(t[o])+"'"});e.client.batch(i).then(function(e){r.next(),r.complete()}).catch(function(e){return r.error(e)})})},t}();e.Model=l,function(t){for(var r in t)e.hasOwnProperty(r)||(e[r]=t[r])}(t("./libs/dataTypes"))}),e.file("src/libs/index.js",function(e,t,r,n,i){"use strict";function o(t){for(var r in t)e.hasOwnProperty(r)||(e[r]=t[r])}Object.defineProperty(e,"__esModule",{value:!0}),o(t("./schema")),o(t("./entity")),o(t("./create")),o(t("./remove")),o(t("./update")),o(t("./find")),o(t("./checkTable"))}),e.file("src/libs/schema.js",function(e,t,r,n,i){"use strict";function o(e,t){for(var r=[],n=0;n<e.length;n++)for(var i=e[n],o=0;o<t.length&&i!==t[o];o++)o===t.length-1&&r.push(i);return r}Object.defineProperty(e,"__esModule",{value:!0}),e.objDiff=o;var a=function(){function e(e){this.message="Error",this.name="Model Error",this.errors=e}return e}();e.Error=a;var s=function(){function e(e,t){this.indexes=[],this.tblChked=!1,this.tableName=e,this.parseModel(t),this.indexes.push(["id"])}return e.prototype.createIndex=function(e){this.indexes.push(Array.isArray(e)?e:[e])},e.prototype.parseModel=function(e){var t=e.keys,r=[],n=[],i={},a={};for(var s in e){var u=e[s];"function"!=typeof u&&"keys"!==s&&"model"!==s&&("string"==typeof u?(r.push(s+" "+u),n.push(s)):(r.push(s+" "+u.type),n.push(s),u.default&&(a[s]=u.default),u.required&&(i[s]=u.required),u.validate&&(e["validate_"+s]=u.validate)))}this.columns=r.join(", "),this.keys=t.join(", "),this.allCol=n,this.columnList=o(n,t),this.keyList=t,this.defaults=a,this.require=i},e}();e.SchemaHelper=s;var u=function(){function e(t){if(this.id={type:"uuid",default:"uuid()"},t)if(t instanceof e)for(var r in t)"methods"!==r&&"pre"!==r&&"post"!==r&&"validate"!==r&&"function"==typeof t[r]&&(this[r]=t[r]);else for(var r in t)this[r]=t[r]}return e.prototype.methods=function(e){for(var t in e)this[t]=e[t]},e.prototype.validate=function(e,t){this["validate_"+e]=t},e.prototype.post=function(e,t){Array.isArray(e)||(e=[e]);for(var r=0;r<e.length;r++)switch(e[r]){case"create":this.post_create=t;break;case"update":this.post_update=t;break;case"find":this.post_find=t;break;case"remove":this.post_remove=t}},e.prototype.pre=function(e,t){Array.isArray(e)||(e=[e]);for(var r=0;r<e.length;r++)switch(e[r]){case"create":this.pre_create=t;break;case"update":this.pre_update=t;break;case"find":this.pre_find=t;break;case"remove":this.pre_remove=t}},e}();e.Schema=u}),e.file("src/libs/entity.js",function(e,t,r,n,i){"use strict";var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(e,"__esModule",{value:!0});var a=t("../index"),s=t("./schema"),u=t("rxjs"),c=t("./errors"),l=function(e){function t(t,r,n){var i=e.call(this,r.schema)||this;return i.modified={},i.attributes={},delete i.id,i.model=r,i.toJSON=function(){return delete this.model,delete this.validationObs,delete this.requireObs,delete this.schemaHelper,delete this.modified,delete this.attributes,this},i.schemaHelper=r.schemaHelper,i.integrateItem(t,n),i}return o(t,e),t.prototype.integrateItem=function(e,t){var r=this;void 0===t&&(t={});var n=[],i=[],o=this.schemaHelper.allCol;if(t.useDefaults){var a=this.schemaHelper.defaults;for(var s in a)e[s]||(e[s]=a[s])}for(var l=this,s=0;s<o.length;s++)!function(a){var s=o[a],p=e[s],f=l.schemaHelper.require[s];t.requireChk&&f&&i.push(u.Observable.create(function(e){if(p)e.next(),e.complete();else{var t={};t[s]={message:"boolean"==typeof f?"'"+s+"' is a required field":f,kind:"user defined",path:s,value:p,name:"ValidationError"},e.error(new c.ValidationError(t,r.schemaHelper.tableName+" validation failed"))}})),t.validateChk&&l["validate_"+s]&&"function"==typeof l["validate_"+s]&&n.push(u.Observable.create(function(e){return r["validate_"+s](r[s],function(t){if(t){var n={};return n[s]={message:t||s+" could not be validated",kind:"user defined",path:s,value:p,name:"ValidationError"},e.error(new c.ValidationError(n,r.schemaHelper.tableName+" validation failed"))}e.next(),e.complete()})})),l[s]=p,p&&(l.attributes[s]=p),"function"!=typeof p&&Object.defineProperty(l,s,{get:function(){return p},set:function(e){p=e,this.attributes[s]=e,this.modified[s]=!0}})}(s);i.length>0&&(this.requireObs=i.length>1?u.Observable.merge.apply(this,i):i[0]),n.length>0&&(this.validationObs=n.length>1?u.Observable.merge.apply(this,n):n[0])},t.prototype.isEmpty=function(){for(var e in this.attributes)if(this.attributes.hasOwnProperty(e))return!1;return!0},t.prototype.merge=function(e){for(var t in e)this[t]=e[t];return this},t.prototype.save=function(e){var t=this;return u.Observable.create(function(r){for(var n=[],i=[],o=t.schemaHelper.keyList,s=t.schemaHelper.columnList,u="UPDATE "+t.schemaHelper.tableName+" SET ",c=" WHERE ",l=0;l<s.length;l++){var p=s[l];t[p]&&(u+=p+" = ?, ",n.push(t[p]))}for(var f=0;f<o.length;f++){var p=o[f],h=t[p];h&&(c+=p+" = ? AND ",i.push(h))}var d=u.substring(0,u.length-2)+c.substring(0,c.length-4),v=n.concat(i);return"create"!==e&&"remove"!==e&&(e="update"),a.client.execute(d,v,{prepare:!0}).then(function(n){t["post_"+e]?t["post_"+e](function(e){r.next(e),r.complete()},function(e){return r.error(e)},t):(r.next(t),r.complete())}).catch(function(e){return r.error(e)}),function(){}})},t.prototype.remove=function(e){var t=this;return u.Observable.create(function(r){for(var n=[],i="DELETE FROM "+t.schemaHelper.tableName+" WHERE ",o=t.schemaHelper.keyList,s=0;s<o.length;s++){var u=o[s];t[u]&&(i+=u+" = ? AND ",n.push(t[u]))}return"create"!==e&&"update"!==e&&(e="remove"),a.client.execute(i.substring(0,i.length-4),n,{prepare:!0}).then(function(n){t["post_"+e]?t["post_"+e](function(e){r.next(e),r.complete()},function(e){return r.error(e)},t):(r.next(t),r.complete())}).catch(function(e){return r.error(e)}),function(){}})},t}(s.Schema);e.Entity=l}),e.file("src/libs/errors.js",function(e,t,r,n,i){"use strict";var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function e(e){this.message="Error",this.name="Model Error",this.errors=e}return e}();e.Error=a;var s=function(e){function t(t,r){void 0===r&&(r="Validation error");var n=e.call(this,t)||this;return n.name="ValidationError",n.message=r,n}return o(t,e),t}(a);e.ValidationError=s;var u=function(e){function t(t,r){void 0===r&&(r="Row not found");var n=e.call(this,t)||this;return n.name="NotFoundError",n}return o(t,e),t}(a);e.NotFoundError=u;var c=function(e){function t(t,r){void 0===r&&(r="Invalid action");var n=e.call(this,t)||this;return n.name="InvalidActionError",n.message=r,n}return o(t,e),t}(a);e.InvalidActionError=c}),e.file("src/libs/create.js",function(e,t,r,n,i){"use strict";function o(e,t){var r=[],n="INSERT INTO "+e.schemaHelper.tableName+" (",i=") VALUES (";for(var o in e.attributes){var a=e[o];"now()"===a||"uuid()"===a||"toTimeStamp(now())"===a?(n+=o+", ",i+=a+", "):(n+=o+", ",i+="?, ",r.push(a))}var s=n.substring(0,n.length-2)+i.substring(0,i.length-2)+")";return t&&(t.if&&(s+=" IF "+t.if),t.using&&(s+=" USING "+t.using)),{query:s,params:r}}function a(e,t){return u.Observable.create(function(r){var n=o(e,t);return s.client.execute(n.query,n.params,{prepare:!0}).then(function(t){e.post_create?e.post_create(function(e){r.next(e),r.complete()},function(e){return r.error(e)},e):(r.next(e),r.complete())}).catch(function(e){return r.error(e)})})}Object.defineProperty(e,"__esModule",{value:!0});var s=t("../index"),u=t("rxjs");e.parseQueryInsert=o,e.executeQueryInsert=a}),e.file("src/libs/remove.js",function(e,t,r,n,i){"use strict";function o(e,t){var r=[],n="DELETE FROM "+e.schemaHelper.tableName;t&&t.using&&(n+=" USING "+t.using),n+=" WHERE";for(var i in e.attributes){var o=e[i];n+=" "+i+" = ? AND",r.push(o)}var a=n.substring(0,n.length-4);return t&&t.if&&(a+=" IF "+t.if),{query:a,params:r}}function a(e,t){return u.Observable.create(function(r){var n=o(e,t);return s.client.execute(n.query,n.params,{prepare:!0}).then(function(t){e.post_remove?e.post_remove(function(e){r.next(e),r.complete()},function(e){return r.error(e)},e):(r.next(e),r.complete())}).catch(function(e){return r.error(e)})})}Object.defineProperty(e,"__esModule",{value:!0});var s=t("../index"),u=t("rxjs");e.parseQueryDelete=o,e.executeQueryDelete=a}),e.file("src/libs/update.js",function(e,t,r,n,i){"use strict";function o(e,t,r){if(!e.type)return r.push(e)," "+t+" = ?,";switch(e.type){case"MAP":return"append"===e.action?(r.push(e.payload)," "+t+" = "+t+" + ?,"):"remove"===e.action?(r.push(e.payload)," "+t+" = "+t+" - ?,"):"set"===e.action?(r.push(e.index),r.push(e.payload)," "+t+"[?] = ?,"):(r.push(e.payload)," "+t+" = ?,");case"LIST":if("append"===e.action)return r.push(e.payload)," "+t+" = "+t+" + ?,";if("prepend"===e.action)return r.push(e.payload)," "+t+" = ? + "+t+",";if("remove"===e.action)return r.push(e.payload)," "+t+" = "+t+" - ?,";if("set"===e.action)return r.push(e.index),r.push(e.payload)," "+t+"[?] = ?,";if("reset"===e.action)return r.push(e.payload)," "+t+" = ?,";case"SET":if("append"===e.action)return r.push(e.payload)," "+t+" = "+t+" + ?,";if("remove"===e.action)return r.push(e.payload)," "+t+" = "+t+" - ?,";if("reset"===e.action)return r.push(e.payload)," "+t+" = ?,"}}function a(e,t){var r=e.schemaHelper.keyList,n=e.schemaHelper.columnList,i=[],a="UPDATE "+e.schemaHelper.tableName;t&&t.using&&(a+=" USING "+t.using),a+=" SET";for(var s=0;s<n.length;s++){var u=n[s],c=e.attributes[u];c&&(a+=o(c,u,i))}a=a.substring(0,a.length-1)+" WHERE";for(var l=0;l<r.length;l++){var p=r[l],c=e.attributes[p];c&&(a+=" "+p+" = ? AND",i.push(c))}var f=a.substring(0,a.length-4);return t&&t.if?f+=" IF "+t.if:f+=" IF EXISTS",{query:f,params:i}}function s(e,t){return l.Observable.create(function(r){var n=a(e,t);return u.client.execute(n.query,n.params,{prepare:!0}).then(function(t){e.post_update?e.post_update(function(e){r.next(e),r.complete()},function(e){return r.error(e)},e):(r.next(new c.Entity(e,e.model)),r.complete())}).catch(function(e){return r.error(e)})})}Object.defineProperty(e,"__esModule",{value:!0});var u=t("../index"),c=t("./entity"),l=t("rxjs");e.setVal=o,e.parseQueryUpdate=a,e.executeQueryUpdate=s}),e.file("src/libs/find.js",function(e,t,r,n,i){"use strict";function o(e,t){var r;if(t&&t.attributes){var n=t.attributes;Array.isArray(n)?r=n.join(", "):n.exclude&&(r=c.objDiff(e.schemaHelper.allCol,n.exclude).join(", "))}else r="*";var i="SELECT "+r+" FROM "+e.schemaHelper.tableName+" WHERE",o=[];if(e.isEmpty())i="SELECT "+r+" FROM "+e.schemaHelper.tableName;else{for(var a in e.attributes)i+=" "+a+" = ? AND",o.push(e[a]);i=i.substring(0,i.length-4)}return t&&(t.groupBy&&(i+=" GROUP BY "+t.groupBy),t.orderBy&&(i+=" ORDER BY "+t.orderBy),t.perPartitionLimit&&(i+=" PER PARTITION LIMIT "+t.perPartitionLimit),t.limit&&(i+=" LIMIT "+t.limit),t.allowFiltering&&o.length>0&&(i+=" ALLOW FILTERING")),{query:i,params:o}}function a(e,t){return l.Observable.create(function(r){var n=o(e,t);return s.client.execute(n.query,n.params,{prepare:!0}).then(function(t){var n,i=t.rows;if(0===i.length){var o={message:"No Entities were found",kind:"library defined",name:"NotFoundError"};r.error(new p.NotFoundError(o,"No Entities were found"))}else if(i.length>1){n=[];for(var a=0;a<i.length;a++)n.push(new u.Entity(i[a],e.model))}else n=new u.Entity(i[0]||{},e.model);e.model.schema.post_find?e.model.schema.post_find(function(e){r.next(e),r.complete()},function(e){return r.error(e)},n):(r.next(n),r.complete())}).catch(function(e){return r.error(e)})})}Object.defineProperty(e,"__esModule",{value:!0});var s=t("../index"),u=t("./entity"),c=t("./schema"),l=t("rxjs"),p=t("./errors");e.parseQuerySelect=o,e.executeQuerySelect=a}),e.file("src/libs/checkTable.js",function(e,t,r,n,i){"use strict";function o(e){return"CREATE TABLE IF NOT EXISTS "+e.tableName+" ("+e.columns+", PRIMARY KEY ("+e.keys+"))"}function a(e,t,r){return"CREATE CUSTOM INDEX "+r.tableName+"_"+e+" on "+r.tableName+" ("+t+") using 'org.apache.cassandra.index.sasi.SASIIndex'"}function s(e,t){var r=this;return l.Observable.create(function(e){var n=o(t),i=t.indexes,s=[];return c.client.execute(n).then(function(n){for(var o=0;o<i.length;o++)!function(e){var r=i[e].join("_"),n=i[e].join(", "),o=a(r,n,t);s.push(l.Observable.create(function(e){c.client.execute(o).then(function(t){e.next(),e.complete()}).catch(function(t){e.next(),e.complete()})}))}(o);(s.length>1?l.Observable.merge.apply(r,s):s[0]).subscribe(function(e){},function(t){return e.error(t)},function(){e.next(),e.complete()})}).catch(function(t){e.error(t)}),function(){}}).concat(e)}function u(e,t){return t.tblChked?e:(t.tblChked=!0,s(e,t))}Object.defineProperty(e,"__esModule",{value:!0});var c=t("../index"),l=t("rxjs");e.createTableQuery=o,e.indexQuery=a,e.createTable=s,e.checkTable=u}),e.file("src/libs/dataTypes.js",function(e,t,r,n,i){"use strict";function o(){return"now()"}function a(){return"uuid()"}function s(e){return"toTimeStamp("+e+")"}function u(e,t){return u.schemaString(e,t)}function c(e){return c.schemaString(e)}function l(e){return l.schemaString(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.now=o,e.uuid=a,e.toTimeStamp=s,e.MAP=u,function(e){function t(e,t){return"map<"+e+","+t+">"}function r(e){return{type:"MAP",action:"append",payload:e}}function n(e,t){return{type:"MAP",action:"set",index:e,payload:t}}function i(e){return{type:"MAP",action:"reset",payload:e}}function o(e){return{type:"MAP",action:"remove",payload:e}}e.schemaString=t,e.append=r,e.set=n,e.reset=i,e.remove=o}(u=e.MAP||(e.MAP={})),e.LIST=c,function(e){function t(e){return"list<"+e+">"}function r(e){return{type:"LIST",action:"append",payload:e}}function n(e){return{type:"LIST",action:"prepend",payload:e}}function i(e,t){return{type:"LIST",action:"set",index:e,payload:t}}function o(e){return{type:"LIST",action:"reset",payload:e}}function a(e){return{type:"LIST",action:"remove",payload:e}}e.schemaString=t,e.append=r,e.prepend=n,e.set=i,e.reset=o,e.remove=a}(c=e.LIST||(e.LIST={})),e.SET=l,function(e){function t(e){return"set<"+e+">"}function r(e){return{type:"SET",action:"append",payload:e}}function n(e){return{type:"SET",action:"reset",payload:e}}function i(e){return{type:"SET",action:"remove",payload:e}}e.schemaString=t,e.append=r,e.reset=n,e.remove=i}(l=e.SET||(e.SET={})),e.BLOB="blob",e.ASCII="ascii",e.TEXT="text",e.VARCHAR="varchar",e.BOOLEAN="boolean",e.DOUBLE="double",e.FLOAT="float",e.BIGINT="bigint",e.INT="int",e.SMALLINT="smallint",e.TINYINT="tinyint",e.VARINT="varint",e.UUID="uuid",e.TIMEUUID="timeuuid",e.DATE="date",e.TIME="time",e.TIMESTAMP="timestamp",e.INET="inet",e.COUNTER="counter"}),e.entry="index.js"}),e.global("__extends",function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),e.expose([{alias:"*",pkg:"cassmask/src/index.js"}]),e.main("cassmask/src/index.js"),e.defaultPackageName="cassmask"}(function(e){function t(e){var t=e.charCodeAt(0),r=e.charCodeAt(1);if((f||58!==r)&&(t>=97&&t<=122||64===t)){if(64===t){var n=e.split("/"),i=n.splice(2,n.length).join("/");return[n[0]+"/"+n[1],i||void 0]}var o=e.indexOf("/");if(-1===o)return[e];return[e.substring(0,o),e.substring(o+1)]}}function r(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function n(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=[],n=0,i=arguments.length;n<i;n++)r=r.concat(arguments[n].split("/"));for(var o=[],n=0,i=r.length;n<i;n++){var a=r[n];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===r[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var t=e.match(/\.(\w{1,})$/);return t&&t[1]?e:e+".js"}function o(e){if(f){var t,r=document,n=r.getElementsByTagName("head")[0];/\.css$/.test(e)?(t=r.createElement("link"),t.rel="stylesheet",t.type="text/css",t.href=e):(t=r.createElement("script"),t.type="text/javascript",t.src=e,t.async=!0),n.insertBefore(t,n.firstChild)}}function a(e,t){for(var r in e)e.hasOwnProperty(r)&&t(r,e[r])}function s(e){return{server:require(e)}}function u(e,r){var o=r.path||"./",a=r.pkg||"default",u=t(e);if(u&&(o="./",a=u[0],r.v&&r.v[a]&&(a=a+"@"+r.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!f&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return s(e);var c=v[a];if(!c){if(f)throw"Package not found "+a;return s(a+(e?"/"+e:""))}e=e||"./"+c.s.entry;var l,p=n(o,e),h=i(p),d=c.f[h];return!d&&h.indexOf("*")>-1&&(l=h),d||l||(h=n(p,"/","index.js"),d=c.f[h],d||(h=p+".js",d=c.f[h]),d||(d=c.f[p+".jsx"]),d||(h=p+"/index.jsx",d=c.f[h])),{file:d,wildcard:l,pkgName:a,versions:c.v,filePath:p,validPath:h}}function c(e,t){if(!f)return t(/\.(js|json)$/.test(e)?h.require(e):"");var r=new XMLHttpRequest;r.onreadystatechange=function(){if(4==r.readyState)if(200==r.status){var i=r.getResponseHeader("Content-Type"),o=r.responseText;/json/.test(i)?o="module.exports = "+o:/javascript/.test(i)||(o="module.exports = "+JSON.stringify(o));var a=n("./",e);y.dynamic(a,o),t(y.import(e,{}))}else console.error(e,"not found on request"),t(void 0)},r.open("GET",e,!0),r.send()}function l(e,t){var r=m[e];if(r)for(var n in r){var i=r[n].apply(null,t);if(!1===i)return!1}}function p(e,t){if(void 0===t&&(t={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var n=u(e,t);if(n.server)return n.server;var i=n.file;if(n.wildcard){var a=new RegExp(n.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@/g,"[a-z0-9$_-]+"),"i"),s=v[n.pkgName];if(s){var d={};for(var m in s.f)a.test(m)&&(d[m]=p(n.pkgName+"/"+m));return d}}if(!i){var y="function"==typeof t;if(!1===l("async",[e,t]))return;return c(e,function(e){return y?t(e):null})}var b=n.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var g=i.locals={},x=r(n.validPath);g.exports={},g.module={exports:g.exports},g.require=function(e,t){return p(e,{pkg:b,path:x,v:n.versions})},g.require.main={filename:f?"./":h.require.main.filename,paths:f?[]:h.require.main.paths};var _=[g.module.exports,g.require,g.module,n.validPath,x,b];return l("before-import",_),i.fn.apply(0,_),l("after-import",_),g.module.exports}if(e.FuseBox)return e.FuseBox;var f="undefined"!=typeof window&&window.navigator,h=f?window:global;f&&(h.global=window),e=f&&"undefined"==typeof __fbx__dnm__?e:module.exports;var d=f?window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};f||(h.require=require);var v=d.p=d.p||{},m=d.e=d.e||{},y=function(){function t(){}return t.global=function(e,t){return void 0===t?h[e]:void(h[e]=t)},t.import=function(e,t){return p(e,t)},t.on=function(e,t){m[e]=m[e]||[],m[e].push(t)},t.exists=function(e){try{return void 0!==u(e,{}).file}catch(e){return!1}},t.remove=function(e){var t=u(e,{}),r=v[t.pkgName];r&&r.f[t.validPath]&&delete r.f[t.validPath]},t.main=function(e){return this.mainFile=e,t.import(e,{})},t.expose=function(t){for(var r in t)!function(r){var n=t[r].alias,i=p(t[r].pkg);"*"===n?a(i,function(t,r){return e[t]=r}):"object"==typeof n?a(n,function(t,r){return e[r]=i[t]}):e[n]=i}(r)},t.dynamic=function(t,r,n){this.pkg(n&&n.pkg||"default",{},function(n){n.file(t,function(t,n,i,o,a){new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",r)(!0,t,n,i,o,a,e)})})},t.flush=function(e){var t=v.default;for(var r in t.f)e&&!e(r)||delete t.f[r].locals},t.pkg=function(e,t,r){if(v[e])return r(v[e].s);var n=v[e]={};return n.f={},n.v=t,n.s={file:function(e,t){return n.f[e]={fn:t}}},r(n.s)},t.addPlugin=function(e){this.plugins.push(e)},t}();return y.packages=v,y.isBrowser=void 0!==f,y.isServer=!f,y.plugins=[],e.FuseBox=y}(this));