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

var fs = require('fs'),
    path = require('path'),

    uglify = require('uglify-js'),
    wrench = require('wrench'),

    state = require('./state');

wrench.readdirSyncRecursive(path.join(__dirname, 'rules')).forEach(function (file) {
  var ruleProcessor;
  if (/\.js$/.test(file)) {
    ruleProcessor = require(path.join(__dirname, 'rules', file));
  }
});

module.exports.validate = function (files, logger) {
  var i, len;
  for (i = 0, len = files.length; i < len; i++) {
    validateFile(files[i], logger);
  }
};

function validateFile(file, logger) {
  var source,
      ast;

  // Read the file
  try {
    source = fs.readFileSync(file).toString();
  } catch(e) {
    logger.error('Could not read file "' + file + '": ' + e);
    process.exit(1);
  }

  state.init(file);

  // Parse the source
  try {
    ast = uglify.parse(source, {
      filename: file
    });
  } catch(e) {
    logger.error(e.message + ' ' + file + ':' + e.line + ':' + e.col);
    process.exit(1);
  }

  // Validate the file
  debugger;
  ast.analyze();
}
