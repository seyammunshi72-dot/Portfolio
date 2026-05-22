import fs from 'fs';

async function download() {
  const url = "https://raw.githubusercontent.com/seyammunshi72-dot/Portfolio/main/public/ibm_5150.glb";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync('public/ibm_5150.glb', Buffer.from(buffer));
  console.log("Downloaded successfully! Size:", buffer.byteLength);
}

download();
