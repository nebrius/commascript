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

var uglify = require('uglify-js'),
	state = require('../state'),
	type = require('../type');

uglify.AST_Object.prototype.ruleName = 'AST_Object';

uglify.AST_Object.prototype.getType = function getType(operation) {
	if (operation === 'define') {
		return processDefinition.call(this);
	} else {
		return processInference.call(this, operation);
	}
};

function processDefinition() {
	var definitionEntry,
		properties,
		property,
		prototype,
		argType,
		incompleteType,
		constructorArgumentTypes,
		i, ilen, j, jlen;
	for (i = 0, ilen = this.properties.length; i < ilen; i++) {
		definitionEntry = this.properties[i];
		switch(definitionEntry.key) {
			case 'properties':
				properties = {};
				if (!(definitionEntry.value instanceof uglify.AST_Object)) {
					state.handleError(definitionEntry, 'The properties list must be an object literal');
					return;
				}
				for (j = 0, jlen = definitionEntry.value.properties.length; j < jlen; j++) {
					property = definitionEntry.value.properties[j];
					if (!(property.value instanceof uglify.AST_String)) {
						state.handleError(property, 'The property definition value must be a string');
						return;
					}
					properties[property.key] = type.lookupType(property.value.value);
					if (!properties[property.key]) {
						state.handleError(property, 'Unknown type "' + property.value.value + '"');
						return;
					}
				}
				break;
			case 'prototype':
				if (!(definitionEntry.value instanceof uglify.AST_String)) {
					state.handleError(definitionEntry, 'The prototype name must be a string');
					return;
				}
				prototype = type.lookupType(definitionEntry.value.value);
				if (!prototype) {
					state.handleError(definitionEntry, 'Unknown type "' + definitionEntry.value.value + '"');
					return;
				}
				break;
			case 'constructorArgumentTypes':
				constructorArgumentTypes = [];
				if (!(definitionEntry.value instanceof uglify.AST_Array)) {
					state.handleError(definitionEntry, 'The constructor arguments entry must be an array');
					return;
				}
				for (j = 0, jlen = definitionEntry.value.elements.length; j < jlen; j++) {
					property = definitionEntry.value.elements[j];
					if (!(property instanceof uglify.AST_String)) {
						state.handleError(property, 'Constructor argument definitions must be strings');
						return;
					}
					property = property.value;
					argType = type.lookupType(property);
					if (!argType) {
						state.handleError(property, 'Unknown type "' + property + '"');
						return;
					}
					constructorArgumentTypes.push(argType);
				}
				break;
			default:
				state.handleError('Unknown object definition entry "' + definitionEntry.key + '"');
				return;
		}
	}

	// Create the incomplete type
	incompleteType = new type.IncompleteType('object');
	incompleteType.properties = properties;
	incompleteType.proto = prototype;
	incompleteType.constructorArgumentTypes = constructorArgumentTypes;
	return incompleteType;
}

function processInference(operation) {
	var i, len,
		propertyDefinition,
		incompleteType = new type.IncompleteType('object');
	incompleteType.properties = {};
	for (i = 0, len = this.properties.length; i < len; i++) {
		propertyDefinition = this.properties[i];
		incompleteType.properties[propertyDefinition.key] =
			propertyDefinition.value.getType(operation);
	}
	return incompleteType;
}
