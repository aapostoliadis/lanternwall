// Syntax-checks the game's script straight from lanternwall.html, so there is no extracted copy to go stale.
// Usage: node dev/check.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'lanternwall.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
new vm.Script(scripts[scripts.length - 1][1], { filename: 'lanternwall.html <script>' });
console.log('lanternwall.html: script OK');
