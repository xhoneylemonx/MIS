import { prisma } from './src/lib/prisma';
import { STUDENTS } from './src/lib/data/mock-data';

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
    
    // Add one fake REG sync log just to satisfy counts if needed
    await prisma.syncLog.create({
        data: {
          source: "Seed Script",
          faculty: "All",
          program: "All",
          fetched: STUDENTS.length,
          inserted: STUDENTS.length,
          updated: 0,
          skipped: 0,
          failed: 0,
          status: "SUCCESS"
        }
    });

    console.log("Seeded", STUDENTS.length, "students.");
}
seed().finally(() => prisma.$disconnect());
