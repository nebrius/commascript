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

uglify.AST_ForIn.prototype.ruleName = 'AST_ForIn';

uglify.AST_ForIn.prototype.analyze = function analyze() {
  var name,
      context = state.getCurrentContext();
  if (this.init instanceof uglify.AST_Var) {
    if (state.isContextCommaScript()) {
      name = this.init.definitions[0].name.name;
      if (context.symbolTable[name]) {
        state.handleError(this.init.definitions[0], 'Redefinition of variable "' + name + '"');
      } else {
        context.symbolTable[name] = type.lookupType('string');
      }
    }
  } else if (this.init instanceof uglify.AST_SymbolRef) {
    if (state.isContextCommaScript()) {
      name = this.init.name;
      if (name == 'NaN' || name == 'Infinity' ||
        !type.compareTypes(state.lookupSymbolType(name), type.lookupType('string'))
      ) {
        state.handleError(this, 'For loop iteration variables must be of type string');
      }
    }
  } else if (state.isContextCommaScript()) {
    state.handleError(this.init, 'For...in loops must have a variable declaration or symbol reference as the iteration variable');
  }
  this.body.analyze();
  return {
    result: 'normal'
  };
};
