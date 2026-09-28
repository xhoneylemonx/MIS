const { execSync } = require('child_process');
const fs = require('fs');

try {
  // 2>&1 redirects stderr to stdout so we can capture everything regardless of pass/fail
  const result = execSync('npx jest 2>&1', { cwd: __dirname });
  fs.writeFileSync('test-out.txt', 'TEST RESULTS:\n' + result.toString());
} catch(e) {
  // If it throws, output is also captured here
  fs.writeFileSync('test-out.txt', 'TEST FAILED:\n' + (e.stdout ? e.stdout.toString() : e.message));
}
