require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function test() {
  try {
    const rawRes = await cloudinary.uploader.upload('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', {
      resource_type: 'raw',
      type: 'authenticated',
      folder: 'manuscripts'
    });
    console.log('UPLOADED AS AUTHENTICATED:', rawRes.secure_url);
    
    const signedUrl = cloudinary.utils.url(rawRes.public_id, {
      resource_type: 'raw',
      type: 'authenticated',
      sign_url: true,
      secure: true
    });
    console.log('SIGNED URL:', signedUrl);
    
    const rawFRes = await fetch(signedUrl);
    console.log('RAW FETCH STATUS:', rawFRes.status);
  } catch (err) {
    console.error(err.message);
  }
}
test();
