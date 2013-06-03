/*
The MIT License (MIT)

Copyright (c) <year> <copyright holders>

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

var fs = require('fs'),

	uglify = require('uglify-js');

function validateFile(file, logger) {
	var source,
		ast;

	// Read the file
	try {
		source = fs.readFileSync(file).toString();
	} catch(e) {
		logger.error('Could not read file "' + file + '": ' + e);
		process.exit(1);
	}

	// Parse the source
	try {
		ast = uglify.parse(source, {
			filename: file
		});
	} catch(e) {
		logger.error(file + ':' + e.line + ':' + e.col + ' ' + e.message);
		process.exit(1);
	}

	// Create the symbol table
	ast.figure_out_scope();
	function processContext(node) {
		var symbolTable = {};
		node.walk(new uglify.TreeWalker(function (node, descend) {
			var i, len,
				definitions,
				definition,
				name,
				type,
				value;
			if (node instanceof uglify.AST_Var) {
				definitions = node.definitions;
				for (i = 0, len = definitions.length; i < len; i++) {

					// Validate the definition name
					definition = definitions[i];
					name = definition.name.name;
					if (symbolTable[name]) {
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
					symbolTable[definition.name.name] = {
						type: type,
						value: value
					};
				}
			} else if (node instanceof uglify.AST_SymbolRef) {
				if (!symbolTable[node.name]) {
					throw new Error('Unknown symbol "' + node.name + '" ' +
						file + ':' + node.start.line + ':' + node.start.col);
				}
			} else {
				descend();
			}
			return true;
		}));
		console.dir(symbolTable);
	}
	processContext(ast);
}

module.exports.validate = function (files, logger) {
	var i, len;
	for (i = 0, len = files.length; i < len; i++) {
		validateFile(files[i], logger);
	}
};