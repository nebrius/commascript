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

uglify.AST_Assign.prototype.ruleName = 'AST_Assign';

uglify.AST_Assign.prototype.getType = function getType(operation) {
  var leftType = this.left.getType(operation),
      rightType = this.right.getType(operation);
  if (operation.operation != 'normal') {
    state.handleError(this, 'Assignments cannot exist inside of a ' + operation.class + ' expression');
  } else if (this.operator != '=') {
    if (!type.isNumber(leftType)) {
      state.handleError(this.left, 'Expected a number to the left hand side of  "' +
        leftType.name + '"');
      leftType = new type.NumberType(); // Need to shim this so that we return the expected type for the expression
    } else if(!type.isNumber(rightType)) {
      state.handleError(this.right, 'Invalid type supplied to right-hand side of assignment: expected "number" but got "' +
        rightType.name + '"');
    }
  } else {
    type.compareTypes(leftType, rightType, this.right);
  }
  return leftType;
};
