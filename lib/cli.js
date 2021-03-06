"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.run = run;
Object.defineProperty(exports, "__esModule", {
  value: true
});
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

var validate = require("./commascript.js").validate;

var getErrors = require("./error.js").getErrors;

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var Logger = _interopRequire(require("transport-logger"));

function printHelp() {
  console.log("\nCommaScript validator, version \n\n" + "Usage: commascript [options] [sources]\n\n" + "Options:\n\n" + "  -s, --silent    No output except for results\n" + "  -v, --verbose   Verbose logging\n" + "  -V, --version   The current version of CommaScript\n" + "  -j, --json      Output errors in JSON format" + "  -h, --help      Show this help menu\n");
}

function run(argv) {
  var files = [];
  var logLevel = "info";
  var flagRegex = /^-/;

  // Validate the options
  for (var i = 2, len = argv.length; i < len; i++) {
    var arg = argv[i];
    var outputJson = false;
    if (flagRegex.test(arg)) {
      if (argv[i] === "-s" || argv[i] === "--silent") {
        logLevel = "none";
      } else if (argv[i] === "-v" || argv[i] === "--verbose") {
        logLevel = "debug";
      } else if (argv[i] === "-h" || argv[i] === "--help") {
        printHelp();
        process.exit(0);
      } else if (argv[i] === "-V" || argv[i] === "--version") {
        console.log(require("../package.json").version);
        process.exit(0);
      } else if (argv[i] === "j" || argv[i] === "--json") {
        outputJson = true;
      } else {
        console.error("Invalid flag \"" + arg + "\"");
        process.exit(1);
      }
    } else {
      if (!fs.existsSync(argv[i])) {
        console.error("File \"" + argv[i] + "\"does not exists");
        process.exit(1);
      }
      files.push(path.resolve(arg));
    }
  }

  if (outputJson) {
    logLevel = "error";
  }

  // Invoke the validator with the proper logger
  validate(files, new Logger({
    minLevel: logLevel,
    colorize: true,
    prependLevel: true
  }));

  // Print the errors
  if (outputJson) {
    console.log(getErrors());
  } else {
    getErrors().forEach(function (error) {
      console.error(error.message + " " + error.file + ":" + error.line + ":" + error.column);
    });
  }
}
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxDQUFDLENBQUM7S0FDL0I7R0FDRjs7QUFFRCxNQUFJLFVBQVUsRUFBRTtBQUNkLFlBQVEsR0FBRyxPQUFPLENBQUM7R0FDcEI7OztBQUdELFVBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUM7QUFDekIsWUFBUSxFQUFFLFFBQVE7QUFDbEIsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLElBQUk7R0FDbkIsQ0FBQyxDQUFDLENBQUM7OztBQUdKLE1BQUksVUFBVSxFQUFFO0FBQ2QsV0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0dBQzFCLE1BQU07QUFDTCxhQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDN0IsYUFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekYsQ0FBQyxDQUFDO0dBQ0o7Q0FDRiIsImZpbGUiOiJjbGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbkNvcHlyaWdodCAoYykgMjAxMy0yMDE0IEJyeWFuIEh1Z2hlcyA8YnJ5YW5AdGhlb3JldGljYWxpZGVhdGlvbnMuY29tPiAoaHR0cDovL3RoZW9yZXRpY2FsaWRlYXRpb25zLmNvbSlcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuKi9cblxuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL2NvbW1hc2NyaXB0LmpzJztcbmltcG9ydCB7IGdldEVycm9ycyB9IGZyb20gJy4vZXJyb3IuanMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IExvZ2dlciBmcm9tICd0cmFuc3BvcnQtbG9nZ2VyJztcblxuZnVuY3Rpb24gcHJpbnRIZWxwKCkge1xuICBjb25zb2xlLmxvZygnXFxuQ29tbWFTY3JpcHQgdmFsaWRhdG9yLCB2ZXJzaW9uIFxcblxcbicgK1xuICAgICdVc2FnZTogY29tbWFzY3JpcHQgW29wdGlvbnNdIFtzb3VyY2VzXVxcblxcbicgK1xuICAgICdPcHRpb25zOlxcblxcbicgK1xuICAgICcgIC1zLCAtLXNpbGVudCAgICBObyBvdXRwdXQgZXhjZXB0IGZvciByZXN1bHRzXFxuJyArXG4gICAgJyAgLXYsIC0tdmVyYm9zZSAgIFZlcmJvc2UgbG9nZ2luZ1xcbicgK1xuICAgICcgIC1WLCAtLXZlcnNpb24gICBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIENvbW1hU2NyaXB0XFxuJyArXG4gICAgJyAgLWosIC0tanNvbiAgICAgIE91dHB1dCBlcnJvcnMgaW4gSlNPTiBmb3JtYXQnICtcbiAgICAnICAtaCwgLS1oZWxwICAgICAgU2hvdyB0aGlzIGhlbHAgbWVudVxcbicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcnVuKGFyZ3YpIHtcbiAgdmFyIGZpbGVzID0gW107XG4gIHZhciBsb2dMZXZlbCA9ICdpbmZvJztcbiAgdmFyIGZsYWdSZWdleCA9IC9eLS87XG5cbiAgLy8gVmFsaWRhdGUgdGhlIG9wdGlvbnNcbiAgZm9yICh2YXIgaSA9IDIsIGxlbiA9IGFyZ3YubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgYXJnID0gYXJndltpXTtcbiAgICB2YXIgb3V0cHV0SnNvbiA9IGZhbHNlO1xuICAgIGlmIChmbGFnUmVnZXgudGVzdChhcmcpKSB7XG4gICAgICBpZiAoYXJndltpXSA9PT0gJy1zJyB8fCBhcmd2W2ldID09PSAnLS1zaWxlbnQnKSB7XG4gICAgICAgIGxvZ0xldmVsID0gJ25vbmUnO1xuICAgICAgfSBlbHNlIGlmIChhcmd2W2ldID09PSAnLXYnIHx8IGFyZ3ZbaV0gPT09ICctLXZlcmJvc2UnKSB7XG4gICAgICAgIGxvZ0xldmVsID0gJ2RlYnVnJztcbiAgICAgIH0gZWxzZSBpZiAoYXJndltpXSA9PT0gJy1oJyB8fCBhcmd2W2ldID09PSAnLS1oZWxwJykge1xuICAgICAgICBwcmludEhlbHAoKTtcbiAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgfSBlbHNlIGlmIChhcmd2W2ldID09PSAnLVYnIHx8IGFyZ3ZbaV0gPT09ICctLXZlcnNpb24nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb24pO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICB9IGVsc2UgaWYoYXJndltpXSA9PT0gJ2onIHx8IGFyZ3ZbaV0gPT09ICctLWpzb24nKSB7XG4gICAgICAgIG91dHB1dEpzb24gPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBmbGFnIFwiJyArIGFyZyArICdcIicpO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhhcmd2W2ldKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGaWxlIFwiJyArIGFyZ3ZbaV0gKyAnXCJkb2VzIG5vdCBleGlzdHMnKTtcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgfVxuICAgICAgZmlsZXMucHVzaChwYXRoLnJlc29sdmUoYXJnKSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG91dHB1dEpzb24pIHtcbiAgICBsb2dMZXZlbCA9ICdlcnJvcic7XG4gIH1cblxuICAvLyBJbnZva2UgdGhlIHZhbGlkYXRvciB3aXRoIHRoZSBwcm9wZXIgbG9nZ2VyXG4gIHZhbGlkYXRlKGZpbGVzLCBuZXcgTG9nZ2VyKHtcbiAgICBtaW5MZXZlbDogbG9nTGV2ZWwsXG4gICAgY29sb3JpemU6IHRydWUsXG4gICAgcHJlcGVuZExldmVsOiB0cnVlXG4gIH0pKTtcblxuICAvLyBQcmludCB0aGUgZXJyb3JzXG4gIGlmIChvdXRwdXRKc29uKSB7XG4gICAgY29uc29sZS5sb2coZ2V0RXJyb3JzKCkpO1xuICB9IGVsc2Uge1xuICAgIGdldEVycm9ycygpLmZvckVhY2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UgKyAnICcgKyBlcnJvci5maWxlICsgJzonICsgZXJyb3IubGluZSArICc6JyArIGVycm9yLmNvbHVtbik7XG4gICAgfSk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==