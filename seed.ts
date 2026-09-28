import { PrismaClient } from '@prisma/client';
import { STUDENTS } from './src/lib/data/mock-data';
const prisma = new PrismaClient();

async function seed() {
    for (const student of STUDENTS) {
        await prisma.student.upsert({
            where: { studentId: student.studentId },
            update: {},
            create: {
                studentId: student.studentId,
                name: student.name,
                faculty: student.faculty,
                program: student.program,
                year: student.year,
                bio: student.bio,
            }
        });
    }
    console.log("Seeded", STUDENTS.length, "students.");
}
seed().finally(() => prisma.$disconnect());
