'use commascript';

('#object', {
	name: 'foo',
	properties: {
		'bar': 'string',
		'baz': 'number'
	},
	prototype: 'object',
	constructorArgumentTypes: ['string', 'number']
});

// Primitive data types are a simple tuple
var num = ('number', 10),
	bool = ('boolean', true),
	obj = ('foo', {
		'bar': 'hello world',
		'baz': 10
	});

num = bool;