import fs from 'fs';
const stats = fs.statSync('public/ibm_5150.glb');
console.log(stats.size);
