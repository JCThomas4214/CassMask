!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("rxjs"),require("immutable"),require("cassandra-driver")):"function"==typeof define&&define.amd?define(["rxjs","immutable","cassandra-driver"],t):"object"==typeof exports?exports.cassmask=t(require("rxjs"),require("immutable"),require("cassandra-driver")):e.cassmask=t(e._,e._,e._)}(this,function(e,t,r){return function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(t,r){t.exports=e},function(e,t,r){"use strict";function n(e,t){return n.schemaString(e,t)}function i(e){return i.schemaString(e)}function a(e){return Array.isArray(e)?"{ "+e.join(", ")+" }":a.schemaString(e)}function o(){return"now()"}function s(){return"uuid()"}function u(e){return"toTimeStamp("+e+")"}function c(e,r){t.client=new l.Client(e),t.client.connect(function(e,t){return e&&(console.error("Could not connect to CassandraDB!"),console.log(e)),r?r(e,t):null})}function p(e,t,r){var n=new h.SchemaHelper(e+"s",t);if(r)for(var i=0;i<r.length;i++)n.createIndex(r[i]);return new d(e+"s",t,n)}Object.defineProperty(t,"__esModule",{value:!0});var l=r(6),f=r(2),h=r(5);t.Schema=h.Schema,t.Entity=h.Entity,t.MAP=n,function(e){function t(e,t){return"map<"+e+","+t+">"}function r(e){return{action:"append",payload:"+ "+e}}function n(e,t){return{action:"set",index:"["+e+"]",payload:t}}function i(e){return{action:"reset",payload:e}}function a(e){return{action:"remove",payload:"- { "+e.join(", ")+" }"}}e.schemaString=t,e.append=r,e.set=n,e.reset=i,e.remove=a}(n=t.MAP||(t.MAP={})),t.LIST=i,function(e){function t(e){return"list<"+e+">"}function r(e){return{action:"append",payload:"+ "+e}}function n(e){return{action:"prepend",payload:e+" +"}}function i(e,t){return{action:"set",index:"["+e+"]",payload:t}}function a(e){return{action:"reset",payload:e}}function o(e){return{action:"remove",index:"["+e+"]"}}e.schemaString=t,e.append=r,e.prepend=n,e.set=i,e.reset=a,e.remove=o}(i=t.LIST||(t.LIST={})),t.SET=a,function(e){function t(e){return"set<"+e+">"}function r(e){return{action:"append",payload:"+ "+e}}function n(e){return{action:"prepend",payload:e+" +"}}function i(e,t){return{action:"set",index:"["+e+"]",payload:t}}function a(e){return{action:"reset",payload:e}}function o(e){return{action:"remove",index:"["+e+"]"}}e.schemaString=t,e.append=r,e.prepend=n,e.set=i,e.reset=a,e.remove=o}(a=t.SET||(t.SET={})),t.BLOB="blob",t.ASCII="ascii",t.TEXT="text",t.VARCHAR="varchar",t.BOOLEAN="boolean",t.DOUBLE="double",t.FLOAT="float",t.BIGINT="bigint",t.INT="int",t.SMALLINT="smallint",t.TINYINT="tinyint",t.VARINT="varint",t.UUID="uuid",t.TIMEUUID="timeuuid",t.DATE="date",t.TIME="time",t.TIMESTAMP="timestamp",t.INET="inet",t.COUNTER="counter",t.now=o,t.uuid=s,t.toTimeStamp=u,t.connect=c,t.model=p;var d=function(){function e(t,r,n,i){this.createTable=h.createTable,this.checkTable=h.checkTable,this.parseQueryInsert=h.parseQueryInsert,this.parseQueryDelete=h.parseQueryDelete,this.parseQueryUpdate=h.parseQueryUpdate,this.parseQuerySelect=h.parseQuerySelect,this.remove=h.remove,this.update=h.update,this.create=h.create,this.find=h.find,this.findOne=h.findOne,this.findById=h.findById,this.seam=h.seam,t instanceof e?(this.obs=r,this.schema=t.schema,this.schemaHelper=t.schemaHelper,this.options=t.options):(this.obs=f.List([]),this.schema=r,this.schemaHelper=n,i&&(this.options=i))}return e.prototype.post=function(e,t){return this.schema.post(e,t)},e.prototype.pre=function(e,t){return this.schema.pre(e,t)},e.prototype.methods=function(e){return this.schema.methods(e)},e.prototype.validate=function(e,t){return this.schema.validate(e,t)},e.prototype.createIndex=function(e){this.schemaHelper.createIndex(e)},e}();t.Model=d},function(e,r){e.exports=t},function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(t,"__esModule",{value:!0});var i=r(1),a=r(4),o=r(0),s=function(e){function t(t,r){var n=e.call(this,t)||this;return n.name="ValidationError",n.message=r,n}return n(t,e),t}(a.Error),u=function(e){function t(t,r,n){var i=e.call(this,r.schema)||this;return i.modified={},i.attributes={},delete i.id,i.model=r,i.toJSON=function(){return delete this.model,delete this.validationObs,delete this.requireObs,delete this.schemaHelper,delete this.modified,delete this.attributes,this},i.schemaHelper=r.schemaHelper,i.integrateItem(t,n),i}return n(t,e),t.prototype.integrateItem=function(e,t){var r=this;void 0===t&&(t={});for(var n=[],i=[],a=this.schemaHelper.allCol,u=function(u){var p=a[u],l=e[p],f=c.schemaHelper.require[p];t.requireChk&&f&&i.push(o.Observable.create(function(e){if(l)e.next(),e.complete();else{var t={};t[p]={message:"boolean"==typeof f?"'"+p+"' is a required field":f,kind:"user defined",path:p,value:l,name:"ValidationError"},e.error(new s(t,r.schemaHelper.tableName+" validation failed"))}})),t.validateChk&&c["validate_"+p]&&"function"==typeof c["validate_"+p]&&n.push(o.Observable.create(function(e){return r["validate_"+p](r[p],function(t){if(t){var n={};return n[p]={message:t?t:p+" could not be validated",kind:"user defined",path:p,value:l,name:"ValidationError"},e.error(new s(n,r.schemaHelper.tableName+" validation failed"))}e.next(),e.complete()})})),c[p]=l,l&&(c.attributes[p]=l),"function"!=typeof l&&Object.defineProperty(c,p,{get:function(){return l},set:function(e){l=e,this.attributes[p]=e,this.modified[p]=!0}})},c=this,p=0;p<a.length;p++)u(p);i.length>0&&(this.requireObs=i.length>1?o.Observable.merge.apply(this,i):i[0]),n.length>0&&(this.validationObs=n.length>1?o.Observable.merge.apply(this,n):n[0])},t.prototype.isEmpty=function(){for(var e in this.attributes)if(this.attributes.hasOwnProperty(e))return!1;return!0},t.prototype.merge=function(e){for(var t in e)this[t]=e[t];return this},t.prototype.save=function(e){var t=this;return o.Observable.create(function(r){for(var n=[],a=[],o=t.schemaHelper.keyList,s=t.schemaHelper.columnList,u="UPDATE "+t.schemaHelper.tableName+" SET ",c=" WHERE ",p=0;p<s.length;p++){var l=s[p];t[l]&&(u+=l+" = ?, ",n.push(t[l]))}for(var f=0;f<o.length;f++){var l=o[f],h=t[l];h&&(c+=l+" = ? AND ",a.push(h))}var d=u.substring(0,u.length-2)+c.substring(0,c.length-4),v=n.concat(a);return"create"!==e&&"remove"!==e&&(e="update"),i.client.execute(d,v,{prepare:!0}).then(function(n){t["post_"+e]?t["post_"+e](function(e){r.next(e),r.complete()},function(e){return r.error(e)},t):(r.next(t),r.complete())}).catch(function(e){return r.error(e)}),function(){}})},t.prototype.remove=function(e){var t=this;return o.Observable.create(function(r){for(var n=[],a="DELETE FROM "+t.schemaHelper.tableName+" WHERE ",o=t.schemaHelper.keyList,s=0;s<o.length;s++){var u=o[s];t[u]&&(a+=u+" = ? AND ",n.push(t[u]))}return"create"!==e&&"update"!==e&&(e="remove"),i.client.execute(a.substring(0,a.length-4),n,{prepare:!0}).then(function(n){t["post_"+e]?t["post_"+e](function(e){r.next(e),r.complete()},function(e){return r.error(e)},t):(r.next(t),r.complete())}).catch(function(e){return r.error(e)}),function(){}})},t}(a.Schema);t.Entity=u},function(e,t,r){"use strict";function n(e,t){for(var r=[],n=0;n<e.length;n++)for(var i=e[n],a=0;a<t.length&&i!==t[a];a++)a===t.length-1&&r.push(i);return r}Object.defineProperty(t,"__esModule",{value:!0}),t.objDiff=n;var i=function(){function e(e){this.message="Error",this.name="Model Error",this.errors=e}return e}();t.Error=i;var a=function(){function e(e,t){this.indexes=[],this.tblChked=!1,this.tableName=e,this.parseModel(t),this.indexes.push(["id"])}return e.prototype.createIndex=function(e){this.indexes.push(Array.isArray(e)?e:[e])},e.prototype.parseModel=function(e){var t=e.keys,r=[],i=[],a={},o={};for(var s in e){var u=e[s];"function"!=typeof u&&"keys"!==s&&"model"!==s&&("string"==typeof u?(r.push(s+" "+u),i.push(s)):(r.push(s+" "+u.type),i.push(s),u.default&&(o[s]=u.default),u.required&&(a[s]=u.required),u.validate&&(e["validate_"+s]=u.validate)))}this.columns=r.join(", "),this.keys=t.join(", "),this.allCol=i,this.columnList=n(i,t),this.keyList=t,this.defaults=o,this.require=a},e}();t.SchemaHelper=a;var o=function(){function e(t){if(this.id={type:"uuid",default:"uuid()"},t)if(t instanceof e)for(var r in t)"methods"!==r&&"pre"!==r&&"post"!==r&&"validate"!==r&&"function"==typeof t[r]&&(this[r]=t[r]);else for(var r in t)this[r]=t[r]}return e.prototype.methods=function(e){for(var t in e)this[t]=e[t]},e.prototype.validate=function(e,t){this["validate_"+e]=t},e.prototype.post=function(e,t){Array.isArray(e)||(e=[e]);for(var r=0;r<e.length;r++)switch(e[r]){case"create":this.post_create=t;break;case"update":this.post_update=t;break;case"find":this.post_find=t;break;case"remove":this.post_remove=t}},e.prototype.pre=function(e,t){Array.isArray(e)||(e=[e]);for(var r=0;r<e.length;r++)switch(e[r]){case"create":this.pre_create=t;break;case"update":this.pre_update=t;break;case"find":this.pre_find=t;break;case"remove":this.pre_remove=t}},e}();t.Schema=o},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(4);t.Schema=n.Schema,t.SchemaHelper=n.SchemaHelper;var i=r(3);t.Entity=i.Entity;var a=r(8);t.createTable=a.createTable,t.checkTable=a.checkTable;var o=r(7);t.create=o.create,t.parseQueryInsert=o.parseQueryInsert;var s=r(12);t.remove=s.remove,t.parseQueryDelete=s.parseQueryDelete;var u=r(14);t.update=u.update,t.parseQueryUpdate=u.parseQueryUpdate;var c=r(9);t.find=c.find,t.parseQuerySelect=c.parseQuerySelect;var p=r(11);t.findOne=p.findOne;var l=r(10);t.findById=l.findById;var f=r(13);t.seam=f.seam},function(e,t){e.exports=r},function(e,t,r){"use strict";function n(e,t){var r=this;return s.Observable.create(function(n){var i=[],o="INSERT INTO "+r.schemaHelper.tableName+" (",s=") VALUES (";for(var u in e.attributes){var c=e[u];"now()"===c||"uuid()"===c||"toTimeStamp(now())"===c?(o+=u+", ",s+=c+", "):(o+=u+", ",s+="?, ",i.push(c))}var p=o.substring(0,o.length-2)+s.substring(0,s.length-2)+")";return t&&(t.if&&(p+=" IF NOT EXISTS"),t.using&&(p+=" USING "+t.using)),a.client.execute(p,i,{prepare:!0}).then(function(t){e.post_create?e.post_create(function(e){n.next(e),n.complete()},function(e){return n.error(e)},e):(n.next(e),n.complete())}).catch(function(e){return n.error(e)}),function(){}})}function i(e,t){var r=u.List(this.obs);e=Array.isArray(e)?e:[e];for(var n=[],i=[],c=[],p=[],l=this.schemaHelper.defaults,f=function(r){var a=e[r];for(var u in l)a[u]||(a[u]=l[u]);a=new o.Entity(a,h,{validateChk:!0,requireChk:!0}),a.requireObs&&i.push(a.requireObs),a.validationObs&&n.push(a.validationObs),a.pre_create&&c.push(s.Observable.create(function(e){a.pre_create(function(){e.next(),e.complete()},function(t){return e.error(t)},a)})),p.push(h.parseQueryInsert(a,t))},h=this,d=0;d<e.length;d++)f(d);return i.length>0&&(r=r.push(i.length>1?s.Observable.merge.apply(this,i):i[0])),n.length>0&&(r=r.push(n.length>1?s.Observable.merge.apply(this,n):n[0])),this.schema.pre_create&&(r=r.push(c.length>1?s.Observable.merge.apply(this,c):c[0])),r=r.concat(p),new a.Model(this,r)}Object.defineProperty(t,"__esModule",{value:!0});var a=r(1),o=r(3),s=r(0),u=r(2);t.parseQueryInsert=n,t.create=i},function(e,t,r){"use strict";function n(e){var t=this;return e.insert(0,o.Observable.create(function(e){var r=t.schemaHelper.tableName,n="CREATE TABLE IF NOT EXISTS "+r+" ("+t.schemaHelper.columns+", PRIMARY KEY ("+t.schemaHelper.keys+"))",i=t.schemaHelper.indexes,s=[];return a.client.execute(n).then(function(n){for(var u=function(e){var t=i[e].join("_"),n=i[e].join(", "),u="CREATE CUSTOM INDEX "+r+"_"+t+" on "+r+" ("+n+") using 'org.apache.cassandra.index.sasi.SASIIndex'";s.push(o.Observable.create(function(e){a.client.execute(u).then(function(t){e.next(),e.complete()}).catch(function(t){e.next(),e.complete()})}))},c=0;c<i.length;c++)u(c);(s.length>1?o.Observable.merge.apply(t,s):s[0]).subscribe(function(e){},function(t){return e.error(t)},function(){e.next(),e.complete()})}).catch(function(t){return e.error(t)}),function(){}}))}function i(e){return this.schemaHelper.tblChked?e:(this.schemaHelper.tblChked=!0,this.createTable(e))}Object.defineProperty(t,"__esModule",{value:!0});var a=r(1),o=r(0);t.createTable=n,t.checkTable=i},function(e,t,r){"use strict";function n(e,t){var r=this;return c.Observable.create(function(n){var i;if(t&&t.attributes){var a=t.attributes;Array.isArray(a)?i=a.join(","):a.exclude&&(i=u.objDiff(r.schemaHelper.allCol,a.exclude).join(","))}else i="*";var c="SELECT "+i+" FROM "+r.schemaHelper.tableName+" WHERE",p=[];if(e.isEmpty())c="SELECT "+i+" FROM "+r.schemaHelper.tableName;else{for(var f in e.attributes)c+=" "+f+" = ? AND",p.push(e[f]);c=c.substring(0,c.length-4)}return t&&(t.groupBy&&(c+=" GROUP BY "+t.groupBy),t.orderBy&&(c+=" ORDER BY "+t.orderBy),t.perPartitionLimit&&(c+=" PRE PARTITION LIMIT "+t.perPartitionLimit),t.limit&&(c+=" LIMIT "+t.limit),t.allowFiltering&&p.length>0&&(c+=" ALLOW FILTERING")),o.client.execute(c,p,{prepare:!0}).then(function(e){var t,i=e.rows;if(0===i.length){var a={message:"No Entities were found",kind:"library defined",name:"NotFoundError"};n.error(new l(a,"No Entities were found"))}else if(i.length>1){t=[];for(var o=0;o<i.length;o++)t.push(new s.Entity(i[o],r))}else t=new s.Entity(i[0]||{},r);r.schema.post_find?r.schema.post_find(function(e){n.next(e),n.complete()},function(e){return n.error(e)},t):(n.next(t),n.complete())}).catch(function(e){return n.error(e)}),function(){}})}function i(e,t){var r=p.List(this.obs),n=new s.Entity(e||{},this);return n.pre_find&&(r=r.push(c.Observable.create(function(e){n.pre_find(function(){e.next(),e.complete()},function(t){return e.error(t)},n)}))),r=r.push(this.parseQuerySelect(n,t)),new o.Model(this,r)}var a=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(t,"__esModule",{value:!0});var o=r(1),s=r(3),u=r(4),c=r(0),p=r(2),l=function(e){function t(t,r){var n=e.call(this,t)||this;return n.message="Row not found",n.name="NotFoundError",n}return a(t,e),t}(u.Error);t.parseQuerySelect=n,t.find=i},function(e,t,r){"use strict";function n(e,t){var r=this,n=u.List(this.obs),c=new a.Entity({id:e},this);return c.pre_find&&(n=n.push(s.Observable.create(function(e){c.pre_find(function(){e.next(),e.complete()},function(t){return e.error(t)},c)}))),n=n.push(s.Observable.create(function(n){var s;if(t&&t.attributes){var u=t.attributes;Array.isArray(u)?s=u.join(","):u.exclude&&(s=o.objDiff(r.schemaHelper.allCol,u.exclude).join(","))}else s="*";var p="SELECT "+s+" FROM "+r.schemaHelper.tableName+" WHERE id = "+e;return i.client.execute(p).then(function(e){var t,i=e.rows;if(0===i.length)n.error({message:"No Entities were found",statusCode:404});else if(i.length>1){t=[];for(var o=0;o<i.length;o++)t.push(new a.Entity(i[o],r))}else t=new a.Entity(i[0],r);c.post_find?c.post_find(function(e){n.next(e),n.complete()},function(e){return n.error(e)},t):(n.next(t),n.complete())}).catch(function(e){return n.error(e)}),function(){}})),new i.Model(this,n)}Object.defineProperty(t,"__esModule",{value:!0});var i=r(1),a=r(3),o=r(4),s=r(0),u=r(2);t.findById=n},function(e,t,r){"use strict";function n(e,t){var r=s.List(this.obs),n=new a.Entity(e||{},this);return t||(t={}),t.limit=1,n.pre_find&&(r=r.push(o.Observable.create(function(e){n.pre_find(function(){e.next(),e.complete()},function(t){return e.error(t)},n)}))),r=r.push(this.parseQuerySelect(n,t)),new i.Model(this,r)}Object.defineProperty(t,"__esModule",{value:!0});var i=r(1),a=r(3),o=r(0),s=r(2);t.findOne=n},function(e,t,r){"use strict";function n(e,t){var r=this;return s.Observable.create(function(n){var i=[],o="DELETE FROM "+r.schemaHelper.tableName;t&&t.using&&(o+=" USING "+t.using),o+=" WHERE";for(var s in e.attributes){var u=e[s];o+=" "+s+" = ? AND",i.push(u)}var c=o.substring(0,o.length-4);return t&&t.if&&(c+=" IF "+t.if),a.client.execute(c,i,{prepare:!0}).then(function(t){e.post_remove?e.post_remove(function(e){n.next(e),n.complete()},function(e){return n.error(e)},e):(n.next(e),n.complete())}).catch(function(e){return n.error(e)}),function(){}})}function i(e,t){var r=this,n=u.List(this.obs);if(e){Array.isArray(e)||(e=[e]);for(var i=[],c=[],p=function(r){var n=new o.Entity(e[r],l);n.pre_remove&&i.push(s.Observable.create(function(e){n.pre_remove(function(){e.next(),e.complete()},function(t){return e.error(t)},n)})),c.push(l.parseQueryDelete(n,t))},l=this,f=0;f<e.length;f++)p(f);if(this.schema.pre_remove){var h=i.length>1?s.Observable.merge.apply(this,i):i[0];n=n.push(h)}n=n.concat(c)}else n=n.push(s.Observable.create(function(e){return a.client.execute("TRUNCATE "+r.schemaHelper.tableName).then(function(t){e.next(),e.complete()}).catch(function(t){return e.error(t)}),function(){}}));return new a.Model(this,n)}Object.defineProperty(t,"__esModule",{value:!0});var a=r(1),o=r(3),s=r(0),u=r(2);t.parseQueryDelete=n,t.remove=i},function(e,t,r){"use strict";function n(){var e=this.checkTable(this.obs);return(e.size>1?i.Observable.concat.apply(this,e.toArray()):e.first()).filter(function(e){return e})}Object.defineProperty(t,"__esModule",{value:!0});var i=r(0);t.seam=n},function(e,t,r){"use strict";function n(e,t){var r=this;return s.Observable.create(function(n){var i=r.schemaHelper.keyList,s=r.schemaHelper.columnList,u=[],c="UPDATE "+r.schemaHelper.tableName;t&&t.using&&(c+=" USING "+t.using),c+=" SET";for(var p=0;p<s.length;p++){var l=s[p],f=e.attributes[l];f&&(c+=" "+l+" = ?, ",u.push(f))}c=c.substring(0,c.length-2)+" WHERE";for(var h=0;h<i.length;h++){var d=i[h],f=e.attributes[d];f&&(c+=" "+d+" = ? AND",u.push(f))}var v=c.substring(0,c.length-4);return v+=t&&t.if?" IF "+t.if:" IF EXISTS",a.client.execute(v,u,{prepare:!0}).then(function(t){e.post_update?e.post_update(function(e){n.next(e),n.complete()},function(e){return n.error(e)},e):(n.next(new o.Entity(e,r)),n.complete())}).catch(function(e){return n.error(e)}),function(){}})}function i(e,t){var r=u.List(this.obs);e=Array.isArray(e)?e:[e];for(var n=[],i=[],c=[],p=function(r){var a=e[r],u=new o.Entity(a.set,l,{validateChk:!0});u.merge(a.where),u.validationObs&&n.push(u.validationObs),u.pre_update&&i.push(s.Observable.create(function(e){u.pre_update(function(){e.next(),e.complete()},function(t){return e.error(t)},u)})),c.push(l.parseQueryUpdate(u,t||{}))},l=this,f=0;f<e.length;f++)p(f);return n.length>0&&(r=r.push(n.length>1?s.Observable.merge.apply(this,n):n[0])),this.schema.pre_update&&(r=r.push(i.length>1?s.Observable.merge.apply(this,i):i[0])),r=r.concat(c),new a.Model(this,r)}Object.defineProperty(t,"__esModule",{value:!0});var a=r(1),o=r(3),s=r(0),u=r(2);t.parseQueryUpdate=n,t.update=i}])});