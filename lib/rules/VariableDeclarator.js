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

var _nodeJs = require("../node.js");

var registerNodeProcessor = _nodeJs.registerNodeProcessor;
var processNode = _nodeJs.processNode;

var _stateJs = require("../state.js");

var addNamedType = _stateJs.addNamedType;
var enterState = _stateJs.enterState;
var exitState = _stateJs.exitState;
var states = _stateJs.states;

var _errorJs = require("../error.js");

var handleError = _errorJs.handleError;
var handleInternalError = _errorJs.handleInternalError;

var NullType = require("../type.js").NullType;

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
            handleError(node, "Cannot initialize variables to \"null\" because it is ambiguous." + " Try casting null to a named type.");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL1ZhcmlhYmxlRGVjbGFyYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkF3Qm1ELFlBQVk7O0lBQXRELHFCQUFxQixXQUFyQixxQkFBcUI7SUFBRSxXQUFXLFdBQVgsV0FBVzs7dUJBQ2lCLGFBQWE7O0lBQWhFLFlBQVksWUFBWixZQUFZO0lBQUUsVUFBVSxZQUFWLFVBQVU7SUFBRSxTQUFTLFlBQVQsU0FBUztJQUFFLE1BQU0sWUFBTixNQUFNOzt1QkFDSCxhQUFhOztJQUFyRCxXQUFXLFlBQVgsV0FBVztJQUFFLG1CQUFtQixZQUFuQixtQkFBbUI7O0lBQ2hDLFFBQVEsV0FBUSxZQUFZLEVBQTVCLFFBQVE7O0FBRWpCLHFCQUFxQixDQUFDOztBQUVwQixNQUFJLEVBQUUsb0JBQW9COztBQUUxQixnQkFBYyxFQUFBLHdCQUFDLElBQUksRUFBRTs7QUFFbkIsWUFBTyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDakIsV0FBSyxZQUFZO0FBQ2YsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDZCxxQkFBVyxDQUFDLElBQUksRUFBRSxnREFBZ0QsQ0FBQyxDQUFDO1NBQ3JFLE1BQU07QUFDTCxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3RDLGNBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsY0FBSSxJQUFJLFlBQVksUUFBUSxFQUFFO0FBQzVCLHVCQUFXLENBQUMsSUFBSSxFQUFFLGtFQUFnRSxHQUNoRixvQ0FBb0MsQ0FBQyxDQUFDO1dBQ3pDLE1BQU07QUFDTCxnQkFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUM3QixrQkFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2FBQzNDO0FBQ0Qsd0JBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztXQUNsQztBQUNELG1CQUFTLEVBQUUsQ0FBQztTQUNiO0FBQ0QsY0FBTTtBQUFBLEFBQ1IsV0FBSyxlQUFlO0FBQ2xCLGNBQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNuQyxjQUFNO0FBQUEsQUFDUixXQUFLLGNBQWM7QUFDakIsY0FBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ25DLGNBQU07QUFBQSxBQUNSO0FBQ0UsMkJBQW1CLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQUEsS0FDNUQ7QUFDRCxXQUFPO0FBQ0wsWUFBTSxFQUFFLFFBQVE7S0FDakIsQ0FBQztHQUNIOztBQUVELE1BQUksRUFBQSxjQUFDLElBQUksRUFBRTtBQUNULFVBQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztHQUNwQzs7Q0FFRixDQUFDLENBQUMiLCJmaWxlIjoicnVsZXMvVmFyaWFibGVEZWNsYXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG5Db3B5cmlnaHQgKGMpIDIwMTMtMjAxNCBCcnlhbiBIdWdoZXMgPGJyeWFuQHRoZW9yZXRpY2FsaWRlYXRpb25zLmNvbT4gKGh0dHA6Ly90aGVvcmV0aWNhbGlkZWF0aW9ucy5jb20pXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cbiovXG5cbmltcG9ydCB7IHJlZ2lzdGVyTm9kZVByb2Nlc3NvciwgcHJvY2Vzc05vZGUgfSBmcm9tICcuLi9ub2RlLmpzJztcbmltcG9ydCB7IGFkZE5hbWVkVHlwZSwgZW50ZXJTdGF0ZSwgZXhpdFN0YXRlLCBzdGF0ZXMgfSBmcm9tICcuLi9zdGF0ZS5qcyc7XG5pbXBvcnQgeyBoYW5kbGVFcnJvciwgaGFuZGxlSW50ZXJuYWxFcnJvciB9IGZyb20gJy4uL2Vycm9yLmpzJztcbmltcG9ydCB7IE51bGxUeXBlIH0gZnJvbSAnLi4vdHlwZS5qcyc7XG5cbnJlZ2lzdGVyTm9kZVByb2Nlc3Nvcih7XG5cbiAgbmFtZTogJ1ZhcmlhYmxlRGVjbGFyYXRvcicsXG5cbiAgcGFyc2VTdGF0ZW1lbnQobm9kZSkge1xuICAgIC8vIEhhbmRsZSBub2RlLmlkIGhlcmUsIHNpbmNlIFBhdHRlcm5zIGFyZW4ndCAqcXVpdGUqIGZ1bGwgcnVsZXNcbiAgICBzd2l0Y2gobm9kZS5pZC50eXBlKSB7XG4gICAgICBjYXNlICdJZGVudGlmaWVyJzpcbiAgICAgICAgaWYgKCFub2RlLmluaXQpIHtcbiAgICAgICAgICBoYW5kbGVFcnJvcihub2RlLCAnVmFyaWFibGUgZGVjbGFyYXRpb25zIG11c3QgaGF2ZSBhbiBpbml0aWFsaXplcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudGVyU3RhdGUoc3RhdGVzLlBBUlNJTkdfRVhQUkVTU0lPTik7XG4gICAgICAgICAgdmFyIHR5cGUgPSBwcm9jZXNzTm9kZShub2RlLmluaXQpO1xuICAgICAgICAgIGlmICh0eXBlIGluc3RhbmNlb2YgTnVsbFR5cGUpIHtcbiAgICAgICAgICAgIGhhbmRsZUVycm9yKG5vZGUsICdDYW5ub3QgaW5pdGlhbGl6ZSB2YXJpYWJsZXMgdG8gXCJudWxsXCIgYmVjYXVzZSBpdCBpcyBhbWJpZ3VvdXMuJyArXG4gICAgICAgICAgICAgICcgVHJ5IGNhc3RpbmcgbnVsbCB0byBhIG5hbWVkIHR5cGUuJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdHlwZS5kZWNsYXJhdGlvbkxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgIHR5cGUuZGVjbGFyYXRpb25Mb2NhdGlvbiA9IG5vZGUubG9jLnN0YXJ0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkTmFtZWRUeXBlKG5vZGUuaWQubmFtZSwgdHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4aXRTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnT2JqZWN0UGF0dGVybic6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQXJyYXlQYXR0ZXJuJzpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBoYW5kbGVJbnRlcm5hbEVycm9yKCdVbmtub3duIHBhdHRlcm4gdHlwZSAnICsgbm9kZS50eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdDogJ25vcm1hbCdcbiAgICB9O1xuICB9LFxuXG4gIHNjYW4obm9kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJyk7XG4gIH1cblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=