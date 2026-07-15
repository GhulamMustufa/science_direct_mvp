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
      folder: 'manuscripts',
      public_id: 'test_pdf_no_ext'
    });
    console.log('UPLOADED AS RAW NO EXT:', rawRes.secure_url);
    const rawFRes = await fetch(rawRes.secure_url);
    console.log('RAW FETCH STATUS:', rawFRes.status);
    
    // Also try as image with .png extension
    const imgRes = await cloudinary.uploader.upload('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', {
      resource_type: 'image',
      folder: 'manuscripts',
      public_id: 'test_pdf_as_png.png'
    });
    console.log('UPLOADED AS IMAGE PNG:', imgRes.secure_url);
    const imgFRes = await fetch(imgRes.secure_url);
    console.log('IMG FETCH STATUS:', imgFRes.status);
  } catch (err) {
    console.error(err.message);
  }
}
test();
