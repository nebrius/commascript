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

import { registerNodeProcessor, processNode } from '../node.js';
import { addNamedType, enterState, exitState, states, handleError, handleInternalError } from '../state.js';
import { NullType } from '../type.js';

registerNodeProcessor({

  name: 'VariableDeclarator',

  parseStatement(node) {
    // Handle node.id here, since Patterns aren't *quite* full rules
    switch(node.id.type) {
      case 'Identifier':
        if (!node.init) {
          handleError(node, 'Variable declarations must have an initializer');
        } else {
          enterState(states.PARSING_EXPRESSION);
          var type = processNode(node.init);
          if (type instanceof NullType) {
            handleError(node, 'Cannot initialize variables to "null" because it is ambiguous.' +
              ' Try casting null to a named type?');
          } else {
            if (!type.declarationLocation) {
              type.declarationLocation = node.loc.start;
            }
            addNamedType(node.id.name, type);
          }
          exitState();
        }
        break;
      case 'ObjectPattern':
        throw new Error('Not Implemented');
        break;
      case 'ArrayPattern':
        throw new Error('Not Implemented');
        break;
      default:
        handleInternalError('Unknown pattern type ' + node.type);
    }
    return {
      result: 'normal'
    };
  },

  scan(node) {
    throw new Error('Not Implemented');
  }

});
