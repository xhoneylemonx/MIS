const cp = require('child_process');
const fs = require('fs');

console.log("Running fix-types...");
try {
    cp.execSync('node fix-types.js', { stdio: 'inherit' });
} catch (e) {
    console.error(e);
}

console.log("Running TSC...");
try {
    const out = cp.execSync('npx.cmd tsc --noEmit', { stdio: 'pipe' });
    fs.writeFileSync('tsc-out2.txt', out.toString() + '\nTSC PASSED');
    console.log("TSC PASSED");
} catch (e) {
    fs.writeFileSync('tsc-out2.txt', (e.stdout ? e.stdout.toString() : '') + '\n' + (e.stderr ? e.stderr.toString() : ''));
    console.log("TSC FAILED");
}

console.log("Running Build...");
try {
    const buildOut = cp.execSync('npm.cmd run build', { stdio: 'pipe' });
    fs.writeFileSync('build-out2.txt', buildOut.toString() + '\nBUILD PASSED');
    console.log("BUILD PASSED");
} catch (e) {
    fs.writeFileSync('build-out2.txt', (e.stdout ? e.stdout.toString() : '') + '\n' + (e.stderr ? e.stderr.toString() : ''));
    console.log("BUILD FAILED");
}
