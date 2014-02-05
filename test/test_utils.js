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

/*global
expect,
runs,
waitsFor,
it
*/

var path = require('path'),
    exec = require('child_process').exec,
    commascriptBinary = path.join(__dirname, '..', 'bin', 'commascript.js');

module.exports.runTest = function runTest(options) {
  var finished = false,
      testPath = path.join(__dirname, 'tests', options.spec, options.test + '.js'),
      expectedStderr = options.error ?
        options.error + ' ' + testPath + ':' + options.line + ':' + options.column + '\n' : '',
      output;

  it(options.test, function() {
    runs(function () {
      exec('node ' + commascriptBinary + ' ' + testPath, {
        cwd: __dirname
      }, function (error, stdout, stderr) {
        finished = true;
        output = {
          stdout: stdout.replace('\n\r', '\n'),
          stderr: stderr.replace('\n\r', '\n'),
          error: error
        };
      });
    });
    waitsFor(function () {
      return finished;
    });
    runs(function () {
      expect(output.stdout).toEqual('');
      expect(output.stderr).toEqual(expectedStderr);
      expect(output.error).toBeNull();
    });
  });
};
