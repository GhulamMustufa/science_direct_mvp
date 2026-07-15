require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function test() {
  try {
    const res = await cloudinary.uploader.upload('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', {
      resource_type: 'image',
      folder: 'manuscripts',
    });
    console.log('UPLOADED AS IMAGE:', res.secure_url);
    
    // Now try fetching it
    const fetch = require('node-fetch');
    const fRes = await fetch(res.secure_url);
    console.log('FETCH STATUS:', fRes.status);
    
    // Test raw upload
    const rawRes = await cloudinary.uploader.upload('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', {
      resource_type: 'raw',
      folder: 'manuscripts',
    });
    console.log('UPLOADED AS RAW:', rawRes.secure_url);
    const rawFRes = await fetch(rawRes.secure_url);
    console.log('RAW FETCH STATUS:', rawFRes.status);
  } catch (err) {
    console.error(err);
  }
}
test();
