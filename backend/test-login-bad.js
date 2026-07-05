const http = require('http');

async function testLogin(username, password) {
  const res1 = await fetch('http://localhost:8080/index.php/index/login');
  const html = await res1.text();
  const cookies = res1.headers.get('set-cookie');
  
  const match = html.match(/name="csrfToken" value="([^"]+)"/);
  const csrfToken = match[1];
  
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
    redirect: 'manual'
  });
  
  console.log("Status:", res2.status);
  console.log("Location:", res2.headers.get('location'));
}

testLogin('ojs', 'wrongpassword').catch(console.error);
