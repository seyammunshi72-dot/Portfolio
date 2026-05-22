const fs = require('fs');

const path = 'public/ibm_5150.glb';
const h = fs.readFileSync(path);

console.log("Magic:", h.slice(0, 4).toString('ascii'));
console.log("Version:", h.readUInt32LE(4));
console.log("Length expected:", h.readUInt32LE(8));
console.log("Chunk 0 Length:", h.readUInt32LE(12));
console.log("Chunk 0 Type:", h.slice(16, 20).toString('ascii'));

// print first 40 bytes in hex
console.log("Hex:");
console.log(h.slice(0, 40).toString('hex'));
