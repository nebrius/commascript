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

uglify.AST_Var.prototype.ruleName = 'AST_Var';

uglify.AST_Var.prototype.analyze = function analyze() {
  var definitions = this.definitions,
      definition,
      name,
      type,
      i, len,
      context = state.getCurrentContext();

  for (i = 0, len = definitions.length; i < len; i++) {
    definition = definitions[i];
    type = definition.value && definition.value.getType();

    if (state.isContextCommaScript()) {

      // Validate the definition name
      name = definition.name.name;
      if (context.symbolTable[name]) {
        state.handleError(definition, 'Redefinition of variable "' + name + '"');
      }

      // Validate and store the type
      if (type) {
        context.symbolTable[name] = type;
      }
    }
  }
  return {
    result: 'normal'
  };
};
