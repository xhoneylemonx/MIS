const { execSync } = require('child_process');

function run(command) {
    try {
        console.log(`Running: ${command}`);
        const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
        console.log(`[PASS] ${command}\n`);
        return true;
    } catch (e) {
        console.log(`[FAIL] ${command}`);
        console.log(`Error output:\n${e.stdout}\n${e.stderr}\n`);
        return false;
    }
}

console.log("=== PHASE 11 FINAL VERIFICATION ===");
// run('npx.cmd tsc --noEmit');
// run('npx.cmd eslint .');
// run('npx.cmd prisma validate');

const checks = [
    { name: 'TypeScript', cmd: 'npx.cmd tsc --noEmit' },
    { name: 'ESLint', cmd: 'npx.cmd eslint .' },
    { name: 'Prisma Validate', cmd: 'npx.cmd prisma validate' },
    { name: 'Production Build', cmd: 'npm.cmd run build' }
];

let allPass = true;
for (const check of checks) {
    const passed = run(check.cmd);
    if (!passed) allPass = false;
}

if (allPass) {
    console.log("ALL CHECKS PASSED!");
} else {
    console.log("SOME CHECKS FAILED.");
}
