const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    try {
        const categories = await prisma.interestCategory.findMany();
        if (categories.length > 0) {
            console.log('Category found:', categories[0].id);
            await prisma.interest.create({
                data: {
                    name: "Test Interest",
                    nameLower: "test interest",
                    icon: "⭐",
                    categoryId: categories[0].id
                }
            });
            console.log('Successfully created interest!');
        } else { console.log('No categories'); }
    } catch (e) {
        console.error('Error creating interest:', e);
    } finally {
        await prisma.$disconnect();
    }
}
run();
