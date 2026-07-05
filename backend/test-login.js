const http = require('http');

async function testLogin(username, password) {
  // 1. Get login page
  const res1 = await fetch('http://localhost:8080/index.php/index/login');
  const html = await res1.text();
  const cookies = res1.headers.get('set-cookie');
  
  // Extract CSRF token
  const match = html.match(/name="csrfToken" value="([^"]+)"/);
  if (!match) {
    console.log("CSRF token not found");
    return;
  }
  const csrfToken = match[1];
  console.log("Found CSRF:", csrfToken);
  
  // 2. Submit form
  const params = new URLSearchParams();
  params.append('csrfToken', csrfToken);
  params.append('username', username);
  params.append('password', password);
  
  const res2 = await fetch('http://localhost:8080/index.php/index/login/signIn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: params.toString(),
    redirect: 'manual' // We want to see if it redirects (success)
  });
  
  console.log("Status:", res2.status);
  console.log("Location:", res2.headers.get('location'));
}

testLogin('ojs', 'ojspassword').catch(console.error);
