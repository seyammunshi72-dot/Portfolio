import fs from 'fs';
import https from 'https';

async function downloadDriveFile() {
  const fileId = "1-zKSIosOPr1O9LjrELWXifWLTO58o-K8";
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  console.log('Downloading from:', url);
  
  const req = https.get(url, (res) => {
    if (res.statusCode === 302 || res.statusCode === 303) {
      // Handle redirect
      console.log('Redirected to:', res.headers.location);
      https.get(res.headers.location, (res2) => {
        const fileStream = fs.createWriteStream("public/ibm_5150.glb");
        res2.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log('Download completed successfully.');
        });
      });
    } else {
      const fileStream = fs.createWriteStream("public/ibm_5150.glb");
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        console.log('Download completed successfully.');
      });
    }
  });

  req.on('error', (e) => {
    console.error(e);
  });
}

downloadDriveFile();
