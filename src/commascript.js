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

import fs from 'fs';
import path from 'path';
import wrench from 'wrench';
import esprima from 'esprima';
import { setCurrentFile, enterState, exitState, states } from './state';
import { processNode } from './node';

// Load the rule processors
wrench.readdirSyncRecursive(path.join(__dirname, 'rules')).forEach(function (file) {
  if (/\.js$/.test(file)) {
    require(path.join(__dirname, 'rules', file));
  }
});

export function validate(files, logger) {
  for (var i = 0, len = files.length; i < len; i++) {
    validateFile(files[i], logger);
  }
}

function validateFile(file, logger) {

  // Read the file
  var source;
  try {
    source = fs.readFileSync(file).toString();
  } catch(e) {
    logger.error('Could not read file "' + file + '": ' + e);
    process.exit(1);
  }

  // Parse the source
  var ast;
  try {
    ast = esprima.parse(source, {
      loc: true
    });
  } catch(e) {
    logger.error(e.message + ' ' + file + ':' + e.lineNumber + ':' + e.col);
    process.exit(1);
  }
  setCurrentFile(file);

  // TODO: set filename on all nodes

  // Validate the file
  enterState(states.SCANNING);
  debugger;
  processNode(ast);
  exitState();
}
