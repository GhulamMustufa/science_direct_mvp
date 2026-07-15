require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function test() {
  try {
    const rawUrl = 'uiayiw86nmcd3uvw7nkd.pdf'; // The latest one
    const signedUrl = cloudinary.utils.url('manuscripts/uiayiw86nmcd3uvw7nkd.pdf', {
      resource_type: 'raw',
      sign_url: true,
      secure: true
    });
    console.log('SIGNED URL:', signedUrl);
    const fRes = await fetch(signedUrl);
    console.log('FETCH STATUS:', fRes.status);
  } catch (err) {
    console.error(err);
  }
}
test();
