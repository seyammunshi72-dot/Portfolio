const fs = require('fs');

const fileData = fs.readFileSync('public/ibm_5150.glb');
const magic = fileData.toString('utf8', 0, 4);
if (magic !== 'glTF') {
  console.log("Not a gltf");
  process.exit(1);
}

const version = fileData.readUInt32LE(4);
const length = fileData.readUInt32LE(8);
const chunk0Length = fileData.readUInt32LE(12);
const chunk0Type = fileData.toString('utf8', 16, 20);

if (chunk0Type !== 'JSON') process.exit(1);

const jsonBuffer = fileData.subarray(20, 20 + chunk0Length);
const jsonString = jsonBuffer.toString('utf8');
const gltf = JSON.parse(jsonString);

console.log("Nodes:");
gltf.nodes.forEach((n, i) => {
  if (n.scale || n.translation || n.mesh !== undefined) {
     console.log(`Node ${i}:`, n.name, "Scale:", n.scale, "Trans:", n.translation);
  }
});
