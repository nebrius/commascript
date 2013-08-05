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
	handleInternalError: handleInternalError,
	enterContext: enterContext,
	exitContext: exitContext,
	setContextAsCommascript: setContextAsCommascript,
	getCurrentContext: getCurrentContext,
	isContextCommascript: isContextCommascript,
	lookupSymbolType: lookupSymbolType
};

function init(file) {
	currentFile = file;
	stack = [];
}

function processBlock(nodes) {
	if (nodes) {
		var i, len;
		for (i = 0, len = nodes.length; i < len; i++) {
			nodes[i].analyze();
		}
	}
}

function handleError(node, message) {
	console.error(message + ' ' + currentFile + ':' + node.start.line + ':' + node.start.col);
}

function handleInternalError(message) {
	throw new Error('Internal Error: ' + message +
		' This is a bug. Please report it to the project author');
}

function enterContext() {
	stack.push({
		symbolTable: {},
		isCommaScript: false
	});
}

function setContextAsCommascript() {
	getCurrentContext().isCommaScript = true;
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
