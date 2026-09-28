const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const studentCount = await prisma.student.count();
        const interestCount = await prisma.interest.count();
        const groupCount = await prisma.group.count();
        console.log(`Connection successful!`);
        console.log(`Students: ${studentCount}`);
        console.log(`Interests: ${interestCount}`);
        console.log(`Groups: ${groupCount}`);
    } catch (e) {
        console.error('Connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
