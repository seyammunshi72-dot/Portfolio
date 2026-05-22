const fs = require('fs');
const buf = fs.readFileSync('public/computer_model.glb');
const byteLength = buf.readUInt32LE(8);
const jsonChunkLength = buf.readUInt32LE(12);
const jsonChunkType = buf.readUInt32LE(16);
if (jsonChunkType === 0x4E4F534A) {
  const jsonChunkBytes = buf.slice(20, 20 + jsonChunkLength);
  const json = JSON.parse(jsonChunkBytes.toString('utf8'));
  console.log("Nodes:");
  json.nodes.forEach((n, i) => {
    if (n.name) console.log(i, n.name);
  });
}
