'use strict';
const fs = require('fs');
fs.createReadStream('options.js.dist').pipe(fs.createWriteStream('options.js'));