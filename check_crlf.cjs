const fs = require('fs');

const path = 'vercel_test.glb';
const h = fs.readFileSync(path);

// Let's count how many \r\n pairs there are.
let count = 0;
for (let i = 0; i < h.length - 1; i++) {
  if (h[i] === 0x0D && h[i+1] === 0x0A) count++;
}

console.log(`${path}: has ${count} CRLF pairs`);

// Expected length from header
const length = h.readUInt32LE(8);
console.log(`Original Expected length: ${length}, Actual Length: ${h.length}`);
