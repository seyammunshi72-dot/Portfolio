const fs = require('fs');

// Simple hack to estimate bounding box of all POSITION accessors
const fileData = fs.readFileSync('public/ibm_5150.glb');
const chunk0Length = fileData.readUInt32LE(12);
const jsonBuffer = fileData.subarray(20, 20 + chunk0Length);
const gltf = JSON.parse(jsonBuffer.toString('utf8'));

let max = [-Infinity, -Infinity, -Infinity];
let min = [Infinity, Infinity, Infinity];

if (gltf.accessors) {
  gltf.accessors.forEach(acc => {
     if (acc.type === 'VEC3' && acc.max && acc.min) {
        max[0] = Math.max(max[0], acc.max[0]);
        max[1] = Math.max(max[1], acc.max[1]);
        max[2] = Math.max(max[2], acc.max[2]);
        min[0] = Math.min(min[0], acc.min[0]);
        min[1] = Math.min(min[1], acc.min[1]);
        min[2] = Math.min(min[2], acc.min[2]);
     }
  });
}

console.log("Raw Min:", min);
console.log("Raw Max:", max);
console.log("Size:", max[0]-min[0], max[1]-min[1], max[2]-min[2]);
