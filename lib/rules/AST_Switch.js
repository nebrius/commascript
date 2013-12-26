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

uglify.AST_Switch.prototype.ruleName = 'AST_Switch';

uglify.AST_Switch.prototype.analyze = function analyze() {
  var expressionType = this.expression.getType(),
      caseEntries = this.body,
      caseEntry,
      caseEntryRetval,
      caseType,
      hasDefault = false,
      noBreaks = true,
      foundReturn = false,
      retval,
      i, len;

  for (i = 0, len = caseEntries.length; i < len; i++) {
    caseEntry = caseEntries[i];

    // Check the case has a return or break statement in it
    caseEntryRetval = state.processBlock(caseEntry.body);
    if (!caseEntry.expression) {
      hasDefault = true;
      retval = caseEntryRetval;
    } else {

      // Check the expression type
      caseType = caseEntry.expression.getType();
      if (!type.compareTypes(expressionType, caseType) && state.isContextCommaScript()) {
        state.handleError(caseEntry, 'Mismatched case in switch: case type "' + caseType.name +
          '" must match the switch expression type "' + expressionType.name + '"');
      }
    }
    if (caseEntryRetval.result == 'break' || caseEntryRetval.result == 'continue') {
      noBreaks = false;
    } else if (caseEntryRetval.result == 'return') {
      foundReturn = true;
    }
  }

  if (hasDefault && noBreaks && foundReturn) {
    return retval;
  } else {
    return {
      result: 'normal'
    };
  }
};
