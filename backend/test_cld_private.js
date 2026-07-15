require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function test() {
  try {
    const url = cloudinary.utils.private_download_url(
      'manuscripts/uiayiw86nmcd3uvw7nkd.pdf', 'pdf', { resource_type: 'raw' }
    );
    console.log('PRIVATE URL:', url);
    const fRes = await fetch(url);
    console.log('FETCH STATUS:', fRes.status);
  } catch (err) {
    console.error(err);
  }
}
test();
