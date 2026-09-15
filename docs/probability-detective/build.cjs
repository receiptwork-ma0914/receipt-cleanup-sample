'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const destination = path.join(root, 'dist');
fs.mkdirSync(destination, { recursive: true });
for (const name of ['index.html', 'styles.css', 'domain.js', 'content.js', 'app.js']) fs.copyFileSync(path.join(root, name), path.join(destination, name));
console.log('Built dist/ from the five original static application files.');
