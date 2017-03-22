var cassmask = require('../../index.js');

var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp;

var ItemSchema = new cassmask.Schema({
	part: {
		type: cassmask.TEXT,
		default: 'Item'
	},
	created: {
		type: cassmask.TIMESTAMP,
		default: toTimeStamp(now())
	},
	name: {
		type: cassmask.TEXT,
		validate: (name, next) => {
			if(name.length > 5)	next();
			else next('Name is not long enough!');
		},
		required: true
	},
	info: {
		type: cassmask.TEXT,
		required: 'Info is a must!!'
	},
	keys: ['part', 'name']
});

ItemSchema.validate('info', function(info, next) {
	if(info.length > 5) next();
	else next('Info is not long enough!');
});

module.exports = cassmask.model('Item', ItemSchema);
