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

var uglify = require('uglify-js');

uglify.AST_If.prototype.ruleName = 'AST_If';

uglify.AST_If.prototype.analyze = function analyze() {

  var resultA,
      resultB;

  // We don't need the value, but we still need to double check that the expression has no errors
  this.condition.getType({
    type: 'typed'
  });

  if (this.alternative) {
    resultA = this.body.analyze();
    resultB = this.alternative.analyze();
    if (resultA.result == 'return') {
      if (resultB.result == 'return' || resultB.result == 'throw') {
        return resultA;
      }
    } else if(resultB.result == 'return') {
      if (resultA.result == 'throw') {
        return resultB;
      }
    }
  } else {
    this.body.analyze();
  }
  return {
    result: 'normal'
  };
};
