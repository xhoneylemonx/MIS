"use server";

// Data Access Layer - Students (PostgreSQL Integration)
import { prisma } from "@/lib/prisma";

// Lightweight student type returned by data layer
export interface StudentData {
  id: string;
  studentId: string;
  name: string;
  faculty: string;
  program: string;
  year: number;
  bio: string | null;
  dataSource: string;
  interestIds: string[];
  lookingForIds: string[];
  createdAt: string;
}

function mapToStudentData(dbStudent: any): StudentData {
  return {
    id: dbStudent.id,
    studentId: dbStudent.studentId,
    name: dbStudent.name,
    faculty: dbStudent.faculty,
    program: dbStudent.program,
    year: dbStudent.year,
    bio: dbStudent.bio || null,
    dataSource: dbStudent.dataSource || "SEED",
    interestIds: dbStudent.interests?.map((i: any) => i.interestId) || [],
    lookingForIds: dbStudent.lookingFors?.map((l: any) => l.lookingForId) || [],
    createdAt: dbStudent.createdAt?.toISOString?.() || dbStudent.createdAt,
  };
}

const studentIncludes = {
  interests: true,
  lookingFors: true,
};

export async function getStudents(): Promise<StudentData[]> {
  const dbStudents = await prisma.student.findMany({
    include: studentIncludes,
    orderBy: { studentId: "asc" },
  });
  return dbStudents.map(mapToStudentData);
}

export async function getStudentById(id: string): Promise<StudentData | null> {
  const dbStudent = await prisma.student.findUnique({
    where: { id },
    include: studentIncludes,
  });
  return dbStudent ? mapToStudentData(dbStudent) : null;
}

export async function getStudentByStudentId(studentId: string): Promise<StudentData | null> {
  const dbStudent = await prisma.student.findUnique({
    where: { studentId },
    include: studentIncludes,
  });
  return dbStudent ? mapToStudentData(dbStudent) : null;
}

export async function getStudentsByInterest(interestId: string): Promise<StudentData[]> {
  const dbStudents = await prisma.student.findMany({
    where: {
      interests: { some: { interestId } },
    },
    include: studentIncludes,
  });
  return dbStudents.map(mapToStudentData);
}

export async function searchStudents(query: string): Promise<StudentData[]> {
  const q = query.toLowerCase().trim();
  if (!q) return getStudents();

  const dbStudents = await prisma.student.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { studentId: { contains: q } },
      ],
    },
    include: studentIncludes,
    orderBy: { studentId: "asc" },
  });
  return dbStudents.map(mapToStudentData);
}

export async function discoverStudents(filters: {
  search?: string;
  interestIds?: string[];
  year?: number;
  lookingForId?: string;
  excludeStudentId?: string;
  limit?: number;
  offset?: number;
}): Promise<{ students: StudentData[]; total: number }> {
  const where: any = {};
  const conditions: any[] = [];

  if (filters.excludeStudentId) {
    conditions.push({ id: { not: filters.excludeStudentId } });
  }

  if (filters.search) {
    const q = filters.search.trim();
    if (q) {
      conditions.push({
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { studentId: { contains: q } },
          // Also match students who have an interest matching the search
          { interests: { some: { interest: { name: { contains: q, mode: "insensitive" } } } } },
        ],
      });
    }
  }

  if (filters.interestIds && filters.interestIds.length > 0) {
    conditions.push({
      interests: { some: { interestId: { in: filters.interestIds } } },
    });
  }

  if (filters.year) {
    conditions.push({ year: filters.year });
  }

  if (filters.lookingForId) {
    conditions.push({
      lookingFors: { some: { lookingForId: filters.lookingForId } },
    });
  }

  if (conditions.length > 0) {
    where.AND = conditions;
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: studentIncludes,
      orderBy: { studentId: "asc" },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    }),
    prisma.student.count({ where }),
  ]);

  return {
    students: students.map(mapToStudentData),
    total,
  };
}
