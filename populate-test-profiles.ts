import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // We need to add "Valorant" for "สุภาวดี" (or contains "สุภาวดี")
    const supa = await prisma.student.findFirst({
        where: { name: { contains: "สุภาวดี" } }
    });
    
    // We need to add "Minecraft" and "Monster Hunter" for "ภาณุศักดิ์"
    const panu = await prisma.student.findFirst({
        where: { name: { contains: "ภาณุศักดิ์" } }
    });

    if (supa) {
        console.log("Found สุภาวดี: ", supa.name);
        const val = await prisma.interest.findFirst({ where: { nameLower: "valorant" } });
        if (val) {
            await prisma.studentInterest.upsert({
                where: { studentId_interestId: { studentId: supa.id, interestId: val.id } },
                create: { studentId: supa.id, interestId: val.id },
                update: {}
            });
            console.log("Added Valorant to สุภาวดี");
        }
    } else {
        console.log("สุภาวดี NOT FOUND");
    }

    if (panu) {
        console.log("Found ภาณุศักดิ์: ", panu.name);
        let mc = await prisma.interest.findFirst({ where: { nameLower: "minecraft" } });
        
        let mh = await prisma.interest.findFirst({ where: { nameLower: "monster hunter" } });
        if (!mh) {
            // Create "Monster Hunter" in some default category, like Gaming
            const gamingCat = await prisma.interestCategory.findFirst({ where: { name: "Gaming" } });
            mh = await prisma.interest.create({
                data: {
                    name: "Monster Hunter",
                    nameLower: "monster hunter",
                    icon: "🐉",
                    categoryId: gamingCat ? gamingCat.id : (await prisma.interestCategory.findFirst())?.id || ""
                }
            });
            console.log("Created custom interest Monster Hunter");
        }

        if (mc) {
            await prisma.studentInterest.upsert({
                where: { studentId_interestId: { studentId: panu.id, interestId: mc.id } },
                create: { studentId: panu.id, interestId: mc.id },
                update: {}
            });
            console.log("Added Minecraft to ภาณุศักดิ์");
        }
        
        if (mh) {
            await prisma.studentInterest.upsert({
                where: { studentId_interestId: { studentId: panu.id, interestId: mh.id } },
                create: { studentId: panu.id, interestId: mh.id },
                update: {}
            });
            console.log("Added Monster Hunter to ภาณุศักดิ์");
        }

    } else {
        console.log("ภาณุศักดิ์ NOT FOUND");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
