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

"use strict";

var _node = require("../node");

var registerNodeProcessor = _node.registerNodeProcessor;
var processNode = _node.processNode;

var _state = require("../state");

var addNamedType = _state.addNamedType;
var enterState = _state.enterState;
var exitState = _state.exitState;
var states = _state.states;
var handleError = _state.handleError;
var handleInternalError = _state.handleInternalError;

var NullType = require("../type").NullType;

registerNodeProcessor({

  name: "VariableDeclarator",

  parseStatement: function parseStatement(node) {
    // Handle node.id here, since Patterns aren't *quite* full rules
    switch (node.id.type) {
      case "Identifier":
        if (!node.init) {
          handleError(node, "Variable declarations must have an initializer");
        } else {
          enterState(states.PARSING_EXPRESSION);
          var type = processNode(node.init);
          if (type instanceof NullType) {
            handleError(node, "Cannot initialize variables to \"null\" because it is ambiguous." + " Try casting null to a named type?");
          } else {
            if (!type.declarationLocation) {
              type.declarationLocation = node.loc.start;
            }
            addNamedType(node.id.name, type);
          }
          exitState();
        }
        break;
      case "ObjectPattern":
        throw new Error("Not Implemented");
        break;
      case "ArrayPattern":
        throw new Error("Not Implemented");
        break;
      default:
        handleInternalError("Unknown pattern type " + node.type);
    }
    return {
      result: "normal"
    };
  },

  scan: function scan(node) {
    throw new Error("Not Implemented");
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL1ZhcmlhYmxlRGVjbGFyYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkF3Qm1ELFNBQVM7O0lBQW5ELHFCQUFxQixTQUFyQixxQkFBcUI7SUFBRSxXQUFXLFNBQVgsV0FBVzs7cUJBQ21ELFVBQVU7O0lBQS9GLFlBQVksVUFBWixZQUFZO0lBQUUsVUFBVSxVQUFWLFVBQVU7SUFBRSxTQUFTLFVBQVQsU0FBUztJQUFFLE1BQU0sVUFBTixNQUFNO0lBQUUsV0FBVyxVQUFYLFdBQVc7SUFBRSxtQkFBbUIsVUFBbkIsbUJBQW1COztJQUM3RSxRQUFRLFdBQVEsU0FBUyxFQUF6QixRQUFROztBQUVqQixxQkFBcUIsQ0FBQzs7QUFFcEIsTUFBSSxFQUFFLG9CQUFvQjs7QUFFMUIsZ0JBQWMsRUFBQSx3QkFBQyxJQUFJLEVBQUU7O0FBRW5CLFlBQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ2pCLFdBQUssWUFBWTtBQUNmLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2QscUJBQVcsQ0FBQyxJQUFJLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztTQUNyRSxNQUFNO0FBQ0wsb0JBQVUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN0QyxjQUFJLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLGNBQUksSUFBSSxZQUFZLFFBQVEsRUFBRTtBQUM1Qix1QkFBVyxDQUFDLElBQUksRUFBRSxrRUFBZ0UsR0FDaEYsb0NBQW9DLENBQUMsQ0FBQztXQUN6QyxNQUFNO0FBQ0wsZ0JBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7QUFDN0Isa0JBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQzthQUMzQztBQUNELHdCQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7V0FDbEM7QUFDRCxtQkFBUyxFQUFFLENBQUM7U0FDYjtBQUNELGNBQU07QUFBQSxBQUNSLFdBQUssZUFBZTtBQUNsQixjQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbkMsY0FBTTtBQUFBLEFBQ1IsV0FBSyxjQUFjO0FBQ2pCLGNBQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNuQyxjQUFNO0FBQUEsQUFDUjtBQUNFLDJCQUFtQixDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUFBLEtBQzVEO0FBQ0QsV0FBTztBQUNMLFlBQU0sRUFBRSxRQUFRO0tBQ2pCLENBQUM7R0FDSDs7QUFFRCxNQUFJLEVBQUEsY0FBQyxJQUFJLEVBQUU7QUFDVCxVQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7R0FDcEM7O0NBRUYsQ0FBQyxDQUFDIiwiZmlsZSI6InJ1bGVzL1ZhcmlhYmxlRGVjbGFyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5UaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuQ29weXJpZ2h0IChjKSAyMDEzLTIwMTQgQnJ5YW4gSHVnaGVzIDxicnlhbkB0aGVvcmV0aWNhbGlkZWF0aW9ucy5jb20+IChodHRwOi8vdGhlb3JldGljYWxpZGVhdGlvbnMuY29tKVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuXG4qL1xuXG5pbXBvcnQgeyByZWdpc3Rlck5vZGVQcm9jZXNzb3IsIHByb2Nlc3NOb2RlIH0gZnJvbSAnLi4vbm9kZSc7XG5pbXBvcnQgeyBhZGROYW1lZFR5cGUsIGVudGVyU3RhdGUsIGV4aXRTdGF0ZSwgc3RhdGVzLCBoYW5kbGVFcnJvciwgaGFuZGxlSW50ZXJuYWxFcnJvciB9IGZyb20gJy4uL3N0YXRlJztcbmltcG9ydCB7IE51bGxUeXBlIH0gZnJvbSAnLi4vdHlwZSc7XG5cbnJlZ2lzdGVyTm9kZVByb2Nlc3Nvcih7XG5cbiAgbmFtZTogJ1ZhcmlhYmxlRGVjbGFyYXRvcicsXG5cbiAgcGFyc2VTdGF0ZW1lbnQobm9kZSkge1xuICAgIC8vIEhhbmRsZSBub2RlLmlkIGhlcmUsIHNpbmNlIFBhdHRlcm5zIGFyZW4ndCAqcXVpdGUqIGZ1bGwgcnVsZXNcbiAgICBzd2l0Y2gobm9kZS5pZC50eXBlKSB7XG4gICAgICBjYXNlICdJZGVudGlmaWVyJzpcbiAgICAgICAgaWYgKCFub2RlLmluaXQpIHtcbiAgICAgICAgICBoYW5kbGVFcnJvcihub2RlLCAnVmFyaWFibGUgZGVjbGFyYXRpb25zIG11c3QgaGF2ZSBhbiBpbml0aWFsaXplcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudGVyU3RhdGUoc3RhdGVzLlBBUlNJTkdfRVhQUkVTU0lPTik7XG4gICAgICAgICAgdmFyIHR5cGUgPSBwcm9jZXNzTm9kZShub2RlLmluaXQpO1xuICAgICAgICAgIGlmICh0eXBlIGluc3RhbmNlb2YgTnVsbFR5cGUpIHtcbiAgICAgICAgICAgIGhhbmRsZUVycm9yKG5vZGUsICdDYW5ub3QgaW5pdGlhbGl6ZSB2YXJpYWJsZXMgdG8gXCJudWxsXCIgYmVjYXVzZSBpdCBpcyBhbWJpZ3VvdXMuJyArXG4gICAgICAgICAgICAgICcgVHJ5IGNhc3RpbmcgbnVsbCB0byBhIG5hbWVkIHR5cGU/Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdHlwZS5kZWNsYXJhdGlvbkxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgIHR5cGUuZGVjbGFyYXRpb25Mb2NhdGlvbiA9IG5vZGUubG9jLnN0YXJ0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkTmFtZWRUeXBlKG5vZGUuaWQubmFtZSwgdHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4aXRTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnT2JqZWN0UGF0dGVybic6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQXJyYXlQYXR0ZXJuJzpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBoYW5kbGVJbnRlcm5hbEVycm9yKCdVbmtub3duIHBhdHRlcm4gdHlwZSAnICsgbm9kZS50eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdDogJ25vcm1hbCdcbiAgICB9O1xuICB9LFxuXG4gIHNjYW4obm9kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJyk7XG4gIH1cblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=