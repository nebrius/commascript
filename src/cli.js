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

import { validate } from './commascript.js';
import { getErrors } from './error.js';
import fs from 'fs';
import path from 'path';
import Logger from 'transport-logger';

function printHelp() {
  console.log('\nCommaScript validator, version \n\n' +
    'Usage: commascript [options] [sources]\n\n' +
    'Options:\n\n' +
    '  -s, --silent    No output except for results\n' +
    '  -v, --verbose   Verbose logging\n' +
    '  -V, --version   The current version of CommaScript\n' +
    '  -j, --json      Output errors in JSON format' +
    '  -h, --help      Show this help menu\n');
}

export function run(argv) {
  var files = [];
  var logLevel = 'info';
  var flagRegex = /^-/;

  // Validate the options
  for (var i = 2, len = argv.length; i < len; i++) {
    var arg = argv[i];
    var outputJson = false;
    if (flagRegex.test(arg)) {
      if (argv[i] === '-s' || argv[i] === '--silent') {
        logLevel = 'none';
      } else if (argv[i] === '-v' || argv[i] === '--verbose') {
        logLevel = 'debug';
      } else if (argv[i] === '-h' || argv[i] === '--help') {
        printHelp();
        process.exit(0);
      } else if (argv[i] === '-V' || argv[i] === '--version') {
        console.log(require('../package.json').version);
        process.exit(0);
      } else if(argv[i] === 'j' || argv[i] === '--json') {
        outputJson = true;
      } else {
        console.error('Invalid flag "' + arg + '"');
        process.exit(1);
      }
    } else {
      if (!fs.existsSync(argv[i])) {
        console.error('File "' + argv[i] + '"does not exists');
        process.exit(1);
      }
      files.push(path.resolve(arg));
    }
  }

  if (outputJson) {
    logLevel = 'error';
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
    getErrors().forEach((error) => {
      console.error(error.message + ' ' + error.file + ':' + error.line + ':' + error.column);
    });
  }
}
