const cp = require('child_process');
const fs = require('fs');
try {
    const out = cp.execSync('npx.cmd tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
    fs.writeFileSync('tsc-out13.txt', out + '\nTSC PASSED');
    console.log('TSC PASSED');
} catch (e) {
    fs.writeFileSync('tsc-out13.txt', (e.stdout || '') + '\n' + (e.stderr || ''));
    console.log('TSC FAILED');
}
try {
    const out = cp.execSync('npm.cmd run build', { encoding: 'utf-8', stdio: 'pipe' });
    fs.writeFileSync('build-out13.txt', out + '\nBUILD PASSED');
    console.log('BUILD PASSED');
} catch (e) {
    fs.writeFileSync('build-out13.txt', (e.stdout || '') + '\n' + (e.stderr || ''));
    console.log('BUILD FAILED');
}
