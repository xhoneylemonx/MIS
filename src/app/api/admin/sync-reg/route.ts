import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { prisma } from '@/lib/prisma';

let lastRequestTime = 0;
const RATE_LIMIT_MS = 2000; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entryYear = body.entryYear;

    if (!entryYear || typeof entryYear !== 'string') {
      return NextResponse.json({ error: 'entryYear is required' }, { status: 400 });
    }

    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_MS) {
      return NextResponse.json({ error: 'Rate limit exceeded. wait a few seconds.' }, { status: 429 });
    }
    lastRequestTime = now;

    // Use the extremely direct PrintOut endpoint discovered during debugging
    const programId = '65304010'; // 65304010 = วิทยาการคอมพิวเตอร์ 4 ปี
    const url = `https://edu.mju.ac.th/www/studentListPrintOut.aspx?programid=${programId}&admitacadyear=${entryYear}`;
    
    const commonHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
    };

    const getRes = await fetch(url, { method: 'GET', headers: commonHeaders });
    if (!getRes.ok) throw new Error(`GET failed with status ${getRes.status}`);
    
    const html = await getRes.text();
    const $ = cheerio.load(html);

    let scrapedCount = 0;
    
    // We already know this endpoint is scoped strictly to Computer Science!
    const faculty = 'วิทยาศาสตร์';
    const program = 'วิทยาการคอมพิวเตอร์';
    const yearInt = parseInt(entryYear, 10);
    const upsertPromises: any[] = [];

    $('table').each((_, table) => {
        $(table).find('tr').each((_, tr) => {
            const tds = $(tr).find('td');
            if (tds.length >= 4) {
                 const studentId = $(tds[1]).text().trim();
                 let name = $(tds[2]).text().trim();
                 name = name.replace(/\s+/g, ' ').trim();
                 
                 if (studentId.length === 10 && !isNaN(Number(studentId))) {
                     upsertPromises.push(
                         prisma.student.upsert({
                             where: { studentId: studentId },
                             update: {
                                 name: name,
                                 faculty: faculty,
                                 program: program,
                                 year: yearInt
                             },
                             create: {
                                 studentId: studentId,
                                 name: name,
                                 faculty: faculty,
                                 program: program,
                                 year: yearInt
                             }
                         })
                     );
                 }
            }
        });
    });

    await Promise.allSettled(upsertPromises);
    scrapedCount = upsertPromises.length;

    await prisma.syncLog.create({
        data: {
            source: 'Maejo REG',
            faculty: faculty,
            program: program,
            fetched: scrapedCount,
            inserted: scrapedCount,
            updated: 0,
            skipped: 0,
            failed: 0,
            status: 'SUCCESS'
        }
    });

    return NextResponse.json({ success: true, count: scrapedCount, skipped: 0, message: `Synced ${scrapedCount} students successfully` });
  } catch(error: any) {
    console.error('Scraper API Error:', error);
    await prisma.syncLog.create({
        data: {
            source: 'Maejo REG',
            faculty: 'วิทยาศาสตร์',
            program: 'วิทยาการคอมพิวเตอร์',
            fetched: 0,
            inserted: 0,
            updated: 0,
            skipped: 0,
            failed: 1,
            status: 'FAILED'
        }
    }).catch(e => console.error('Failed to write error sync log', e));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

