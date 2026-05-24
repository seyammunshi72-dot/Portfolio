const https = require('https');
const fs = require('fs');

const url = 'https://raw.githubusercontent.com/seyammunshi72-dot/Portfolio/main/public/ibm_5150.glb';
const file = fs.createWriteStream('public/ibm_5150.glb');

https.get(url, (response) => {
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    https.get(response.headers.location, (res) => {
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log('Download completed'); });
    });
  } else {
    response.pipe(file);
    file.on('finish', () => { file.close(); console.log('Download completed'); });
  }
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
