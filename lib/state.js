/*
The MIT License (MIT)

Copyright (c) 2013 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var stack,
	currentFile;

module.exports = {
	init: init,
	processBlock: processBlock,
	handleError: handleError,
	enterContext: enterContext,
	exitContext: exitContext,
	getCurrentContext: getCurrentContext,
	isContextCommascript: isContextCommascript,
	lookupType: lookupType,
	lookupSymbolType: lookupSymbolType,
	compareTypes: compareTypes,
	addObjectType: addObjectType,
	addArrayType: addArrayType,
	addFunctionType: addFunctionType
};

function init(file) {
	currentFile = file;
	stack = [{
		types: {
			'number': {
				baseType: 'number',
				name: 'number'
			},
			'boolean': {
				baseType: 'boolean',
				name: 'boolean'
			},
			'string': {
				baseType: 'string',
				name: 'string'
			}
		},
		symbolTable: {},
		isCommaScript: false
	}];
}

function processBlock(nodes) {
	if (nodes) {
		var i, len;
		for (i = 0, len = nodes.length; i < len; i++) {
			nodes[i].validate();
		}
	}
}

function handleError(node, message) {
	console.error(message + ' ' + currentFile + ':' + node.start.line + ':' + node.start.col);
}

function enterContext(isCommaScript) {
	stack.push({
		types: {},
		symbolTable: {},
		isCommaScript: isCommaScript
	});
}

function exitContext() {
	stack.pop();
}

function getCurrentContext() {
	return stack[stack.length - 1];
}

function isContextCommascript() {
	var i, len;
	for (i = 0, len = stack.length; i < len; i++) {
		if (stack[i].isCommaScript) {
			return true;
		}
	}
	return false;
}

function lookupType(name) {
	var i,
		type;
	for (i = stack.length - 1; i >= 0; i--) {
		type = stack[i].types[name];
		if (type) {
			return type;
		}
	}
}

function lookupSymbolType(name) {
	var i,
		type;
	for (i = stack.length - 1; i >= 0; i--) {
		type = stack[i].symbolTable[name];
		if (type) {
			return type;
		}
	}
}

function compareTypes(type1, type2) {
	if (type1 === type2) {
		return true;
	} else if(type1.baseType === 'null') {
		return ['object', 'array', 'function'].indexOf(type2.baseType) !== -1;
	} else if(type2.baseType === 'null') {
		return ['object', 'array', 'function'].indexOf(type1.baseType) !== -1;
	}
	return false;
}

function addObjectType(name, properties, prototype, constructorArgumentTypes) {
	getCurrentContext().types[name] = {
		name: name,
		baseType: 'object',
		properties: properties,
		prototype: prototype || lookupType('object'),
		constructorArgumentTypes: constructorArgumentTypes
	};
}

function addArrayType(name, elementType) {
	getCurrentContext().types[name] = {
		name: name,
		baseType: 'array',
		elementType: elementType
	};
}

function addFunctionType(name, returnType, argumentTypes) {
	getCurrentContext().types[name] = {
		name: name,
		baseType: 'function',
		returnType: returnType,
		argumentTypes: argumentTypes
	};
}