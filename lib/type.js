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

var state = require('./state'),
	types = {};

// Initialize the built-in types
types.number = new Type('number', 'number');
types.boolean = new Type('boolean', 'boolean');
types.string = new Type('string', 'string');
types.object = new Type('object', 'object');
types.object.properties = {};
types.object.proto = null;
types.object.constructorArgumentTypes = [];

module.exports = {
	Type: Type,
	IncompleteType: IncompleteType,
	lookupType: lookupType,
	addType: addType,
	compareTypes: compareTypes,
	createTypeFromIncomplete: createTypeFromIncomplete,
	castIncompleteType: castIncompleteType
};

function Type(name, baseType) {
	this.name = name;
	this.baseType = baseType;
}

function IncompleteType(baseType) {
	this.baseType = baseType;
}

function lookupType(name) {
	return types[name];
}

function addType(name, definition) {
	if (definition instanceof Type) {
		types[name] = definition;
	} else {
		throw new Error('Internal Error: invalid definition passed to addType().' +
			' This is a bug. Please report it to the project author');
	}
}

function compareTypes(type1, type2) {
	if (type1 instanceof IncompleteType || type2 instanceof IncompleteType) {
		return false;
	} else if (type1 === type2) {
		return true;
	} else if(type1.baseType === 'null') {
		return ['object', 'array', 'function'].indexOf(type2.baseType) !== -1;
	} else if(type2.baseType === 'null') {
		return ['object', 'array', 'function'].indexOf(type1.baseType) !== -1;
	}
	return false;
}

function createTypeFromIncomplete(typeName, operationType, node) {
	var incompleteType = node.getType(operationType),
		newType,
		p;
	if (!incompleteType) {
		return;
	}
	newType = new Type(typeName, incompleteType.baseType);
	for (p in incompleteType) {
		if (p !== 'name' && p !== 'baseType' && incompleteType.hasOwnProperty(p)) {
			newType[p] = incompleteType[p];
		}
	}
	return newType;
}

function castIncompleteType(typeName, operationType, node) {
	var incompleteType = node.getType(operationType),
		definitionType = lookupType(typeName),
		p;
	if (!incompleteType) {
		return;
	}
	if (!definitionType) {
		state.handleError(node, 'Type "' + typeName + '" does not exist');
		return;
	}
	if (incompleteType instanceof Type) {
		if (!compareTypes(incompleteType, definitionType)) {
			state.handleError(node, 'Cannot cast "' + incompleteType .name + '" as "' +
				definitionType.name + '"');
			return;
		}
		return incompleteType;
	} else if (incompleteType instanceof IncompleteType) {
		if (['object', 'array', 'function'].indexOf(definitionType.baseType) !== -1 &&
				incompleteType.baseType === 'null') {
			return definitionType;
		}
		if (definitionType.baseType !== incompleteType.baseType) {
			state.handleError(node, 'Could not cast reconcile types: incompatible base types');
			return;
		}
		switch(incompleteType.baseType) {
			case 'object':
				if (definitionType.proto) {
					state.handleError(node, 'Cannot cast inferred types to objects with prototypes');
					return;
				}
				if (definitionType.constructorArgumentTypes) {
					state.handleError(node, 'Cannot cast inferred types to objects with constructors');
					return;
				}
				for (p in definitionType.properties) {
					if (definitionType.properties.hasOwnProperty(p) &&
							!incompleteType.properties.hasOwnProperty(p)) {
						state.handleError(node, 'Inferred type is missing property "' + p + '"');
						return;
					}
				}
				for (p in incompleteType.properties) {
					if (incompleteType.properties.hasOwnProperty(p)) {
						if (!definitionType.properties.hasOwnProperty(p)) {
							state.handleError(node, 'Inferred type has undeclared property "' + p + '"');
							return;
						}
						if (!compareTypes(definitionType.properties[p], incompleteType.properties[p])) {
							state.handleError(node, 'Inferred type has mismatched type for "' + p + '"');
							return;
						}
					}
				}
				return definitionType;
			case 'array':
				throw new Error('Not Implemented');
				break;
			case 'function':
				throw new Error('Not Implemented');
				break;
		}
	} else {
		state.handleInternalError('Invalid type passed to convertIncompleteType().');
	}
}
