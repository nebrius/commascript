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
	state = require('../state');

module.exports = {
	validate: validate,
	ruleName: 'AST_Var'
};

uglify.AST_Var.prototype.ruleName = 'AST_Var';

function validate(node, file) {
	var definitions = node.definitions,
		definition,
		name,
		type,
		value,
		i, len,
		context = state.getCurrentContext();
	if (context.isCommaType) {
		for (i = 0, len = definitions.length; i < len; i++) {

			// Validate the definition name
			definition = definitions[i];
			name = definition.name.name;
			if (context.symbolTable[name]) {
				throw new Error('Redefinition of "' + name + '" ' +
					file + ':' + node.start.line + ':' + node.start.col);
			}

			// Validate the definition
			if (!definition.value || !(definition.value instanceof uglify.AST_Seq)) {
				throw new Error('Invalid variable declaration ' +
					file + ':' + node.start.line + ':' + node.start.col);
			}
			type = definition.value.car;
			value = definition.value.cdr;

			// Validate the type
			if (!(type instanceof uglify.AST_String)) {
				throw new Error('Invalid type definition ' +
					file + ':' + node.start.line + ':' + node.start.col);
			}
			type = type.value;

			// Validate the value
			switch(type) {
				case 'boolean':
					if (!(value instanceof uglify.AST_Boolean )) {
						throw new Error('Initial value must be a boolean ' +
							file + ':' + node.start.line + ':' + node.start.col);
					}
					break;
				case 'number':
					if (!(value instanceof uglify.AST_Number )) {
						throw new Error('Initial value must be a number ' +
							file + ':' + node.start.line + ':' + node.start.col);
					}
					break;
				case 'string':
					if (!(value instanceof uglify.AST_String )) {
						throw new Error('Initial value must be a string ' +
							file + ':' + node.start.line + ':' + node.start.col);
					}
					break;
				default:
					throw new Error('Invalid type "' + type + '" ' +
						file + ':' + node.start.line + ':' + node.start.col);
			}
			value = value.value;

			// Store the initialization
			context.symbolTable[definition.name.name] = {
				type: type,
				value: value
			};
		}
	}

	// Don't descend into children since we've already processed them
	return false;
}