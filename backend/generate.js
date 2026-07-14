const { spawn } = require('child_process');
const child = spawn('npx', ['drizzle-kit', 'generate'], { stdio: ['pipe', 'pipe', 'pipe'] });
child.stdout.on('data', (data) => {
  process.stdout.write(data);
  if (data.toString().includes('created or renamed')) {
    child.stdin.write('\n');
  }
});
child.stderr.on('data', (data) => {
  process.stderr.write(data);
});
child.on('close', (code) => {
  console.log('child process exited with code ' + code);
});
