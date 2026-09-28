import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // 1. Ensure at least one creator (use the 363 user we just modified or general)
    const creator = await prisma.student.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!creator) {
        console.error('No students found to author mock data!');
        return;
    }

    // 2. Fetch some interests to link
    const interests = await prisma.interest.findMany({ take: 5 });
    const interestIds = interests.map(i => ({ interestId: i.id }));

    // 3. Create mock groups
    await prisma.group.create({
        data: {
            name: "Valorant MJU",
            description: "ชุมชนคนเล่น Valorant ของมหาวิทยาลัย มาเล่นด้วยกัน rank ไหนก็ได้ มาสนุกกัน!",
            creatorId: creator.id,
            interests: { create: interestIds.slice(0, 2) },
            members: { create: { studentId: creator.id } }
        }
    });

    await prisma.group.create({
        data: {
            name: "Tech & Programming Hub",
            description: "กลุ่มสำหรับคนสาย Tech พูดคุยเรื่อง Programming, AI, Web Dev และเทคโนโลยีใหม่ ๆ",
            creatorId: creator.id,
            interests: { create: interestIds.slice(2, 4) },
            members: { create: { studentId: creator.id } }
        }
    });

    // 4. Create mock activities
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    await prisma.activity.create({
        data: {
            title: "Valorant Night",
            description: "มาเล่น Valorant ด้วยกัน! ทั้ง Unrated และ Competitive ยินดีต้อนรับทุก rank",
            date: futureDate.toISOString().split('T')[0],
            time: "19:00",
            location: "Online (Discord)",
            capacity: 10,
            creatorId: creator.id,
            interests: { create: interestIds.slice(0, 2) },
            participants: { create: { studentId: creator.id } }
        }
    });

    await prisma.activity.create({
        data: {
            title: "AI Workshop: Intro to Machine Learning",
            description: "Workshop เบื้องต้นเกี่ยวกับ Machine Learning ใช้ Python และ scikit-learn",
            date: futureDate.toISOString().split('T')[0],
            time: "13:00",
            location: "ห้อง Lab 3 อาคาร IT",
            capacity: 30,
            creatorId: creator.id,
            interests: { create: interestIds.slice(2, 4) },
            participants: { create: { studentId: creator.id } }
        }
    });

    console.log('Successfully seeded 2 Groups and 2 Activities linking to native postgres!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
