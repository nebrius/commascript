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
	type = require('../type'),
	definitionRegex = /^(define|infer)\([\s]*([a-zA-Z0-9_\$]*)[\s]*,[\s]*([a-zA-Z0-9_\$]*)[\s]*\)$/,
	castRegex = /^cast\([\s]*([a-zA-Z0-9_\$]*)[\s]*\)$/;

uglify.AST_Seq.prototype.ruleName = 'AST_Seq';

uglify.AST_Seq.prototype.getType = function getType() {
	var declaration = this.car,
		value = this.cdr,
		valueType,
		operation = {},
		operationType,
		parsedOperation;
	if (!(declaration instanceof uglify.AST_String)) {
		state.handleError(declaration, 'The first value in a definition or cast must be a string');
	} else {
		parsedOperation = definitionRegex.exec(declaration.value);
		if (parsedOperation) {
			operationType = operation.type = parsedOperation[1];
			operation.class = parsedOperation[2];
			operation.name = parsedOperation[3];
		} else {
			parsedOperation = castRegex.exec(declaration.value);
			if (parsedOperation) {
				operationType = operation.type = 'cast';
				operation.name = parsedOperation[1];
			} else {
				state.handleError(declaration, '"' + declaration.value + '" is not a valid declaration');
				return;
			}
		}
		if (operationType === 'define' || operationType === 'infer') {
			valueType = type.createTypeFromIncomplete(operation, value);
			if (valueType) {
				type.addType(operation.name, valueType);
			}
			return valueType;
		} else if (operationType === 'cast') {
			return type.castIncompleteType(operation, value);
		}
	}
};
