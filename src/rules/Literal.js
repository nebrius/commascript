/*
The MIT License (MIT)

Copyright (c) 2013-2014 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

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

import { registerNodeProcessor } from '../node.js';
import { BooleanType, NumberType, StringType, NullType, RegExpType } from '../type.js';
import { handleInternalError } from '../error.js';

registerNodeProcessor({

  name: 'Literal',

  parseExpression(node) {
    var valueType = typeof node.value;
    if (valueType == 'boolean') {
      return new BooleanType({
        node: node
      });
    } else if (valueType == 'number') {
      return new NumberType({
        node: node
      });
    } else if (valueType == 'string') {
      return new StringType({
        node: node
      });
    } else if (node.value === null) {
      return new NullType({
        node: node
      });
    } else if (node.value instanceof RegExp) {
      return new RegExpType({
        node: node
      });
    } else {
      handleInternalError('Unsupported literal type ' + (typeof node.value));
    }
  },

  scan(node) {
    // Do nothing
  },

  declare(node) {
    throw new Error('Not Implemented');
  }

});
