const fs = require('fs');
fs.copyFileSync('dist/ibm_5150.glb', 'public/ibm_5150.glb');
console.log('Copied successfully!');
