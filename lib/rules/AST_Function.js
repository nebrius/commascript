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

uglify.AST_Function.prototype.ruleName = 'AST_Function';

uglify.AST_Function.prototype.getType = function getType(operation) {
	var i, len,
		castType = type.lookupType(operation.name),
		argumentTypes = castType && castType.argumentTypes,
		returnType = castType && castType.returnType,
		context = state.getCurrentContext();
	if (!castType) {
		state.handleError(this.name, 'Type "' + this.name.name + '" is not defined');
		state.exitContext();
		return;
	}
	if (this.argnames.length !== argumentTypes.length) {
		state.handleError(this.argnames[0], 'Mismatched number of arguments');
		state.exitContext();
		return;
	}
	state.enterContext({
		isCommaScript: this.body && this.body[0] instanceof uglify.AST_Directive &&
			this.body[0].value == 'use commascript',
		expectedReturnType: returnType
	});
	for (i = 0, len = this.argnames.length; i < len; i++) {
		context.symbolTable[this.argnames[i].name] = argumentTypes[i];
	}
	state.processBlock(this.body);
	state.exitContext();
};