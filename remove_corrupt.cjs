const fs = require('fs');

const files = [
  'public/computer_model.glb',
  'public/ibm_5150_safe.glb',
  'public/ibm_5150_webp.glb',
  'public/ibm_5150_optimized3.glb',
  'public/ibm_5150_final.glb',
  'public/ibm_5150_optimized.glb',
  'public/ibm_5150_optimized2.glb',
];

for (const f of files) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log('Deleted', f);
  }
}
