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

uglify.AST_Call.prototype.ruleName = 'AST_Call';

uglify.AST_Call.prototype.getType = function getType(operation) {
  var functionType = this.expression.getType(operation),
      args = this.args || [],
      numExpectedArguments = functionType.argumentTypes.length,
      argType,
      i, len;
  function argstring(num) {
    if (!num) {
      return 'no arguments';
    } else if (num == 1) {
      return '1 argument';
    } else {
      return num + ' arguments';
    }
  }
  if (state.isContextCommaScript()) {
    if (!functionType) {
      return;
    } else if (args.length != numExpectedArguments) {
      state.handleError(this, 'Mismatched number of arguments in function call: expected ' + argstring(numExpectedArguments) +
        ' but saw ' + argstring(args.length));
      return;
    }
  }
  for (i = 0, len = args.length; i < len; i++) {
    argType = args[i].getType(operation);
    if (state.isContextCommaScript() && !type.compareTypes(functionType.argumentTypes[i], argType)) {
      state.handleError(this, 'Mismatched function call argument: expected argument ' + i + ' to be of type "' +
        functionType.argumentTypes[i].name + '" but saw argument of type "' + argType.name + '"');
      return;
    }
  }
  return functionType.returnType;
};
