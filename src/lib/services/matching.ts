"use server";

// ============================================================
// Interest Match - Matching Service
// Explainable matching algorithm based on interest overlap
// Uses real PostgreSQL data via Prisma
// ============================================================

import { prisma } from "@/lib/prisma";

export interface MatchInterest {
  id: string;
  name: string;
  icon: string;
}

export interface MatchResult {
  studentId: string;
  studentName: string;
  studentFaculty: string;
  studentProgram: string;
  studentYear: number;
  studentBio: string | null;
  commonInterests: MatchInterest[];
  matchPercentage: number;
  totalUniqueInterests: number;
}

/**
 * Get matches for a student, sorted by match percentage (highest first).
 * Excludes students with 0 common interests.
 * 
 * Formula: matchPercentage = (commonInterests / unionOfInterests) * 100
 * This is the Jaccard similarity coefficient — deterministic and explainable.
 */
export async function getMatchesForStudent(studentId: string, limit: number = 20): Promise<MatchResult[]> {
  // Get the current student's interests
  const currentStudentInterests = await prisma.studentInterest.findMany({
    where: { studentId },
    select: { interestId: true },
  });

  if (currentStudentInterests.length === 0) return [];

  const myInterestIds = new Set(currentStudentInterests.map((si) => si.interestId));

  // Find all students who share at least one interest (excluding self)
  const candidates = await prisma.student.findMany({
    where: {
      id: { not: studentId },
      interests: {
        some: { interestId: { in: [...myInterestIds] } },
      },
    },
    include: {
      interests: {
        include: {
          interest: {
            select: { id: true, name: true, icon: true },
          },
        },
      },
    },
  });

  // Calculate match for each candidate
  const matches: MatchResult[] = candidates.map((candidate) => {
    const candidateInterestIds = new Set(candidate.interests.map((si) => si.interestId));

    // Common interests
    const commonIds = [...myInterestIds].filter((id) => candidateInterestIds.has(id));
    const commonInterests: MatchInterest[] = candidate.interests
      .filter((si) => myInterestIds.has(si.interestId))
      .map((si) => ({
        id: si.interest.id,
        name: si.interest.name,
        icon: si.interest.icon,
      }));

    // Union (Jaccard)
    const unionSize = new Set([...myInterestIds, ...candidateInterestIds]).size;
    const matchPercentage = unionSize > 0 ? Math.round((commonIds.length / unionSize) * 100) : 0;

    return {
      studentId: candidate.id,
      studentName: candidate.name,
      studentFaculty: candidate.faculty,
      studentProgram: candidate.program,
      studentYear: candidate.year,
      studentBio: candidate.bio,
      commonInterests,
      matchPercentage,
      totalUniqueInterests: unionSize,
    };
  });

  return matches
    .filter((m) => m.commonInterests.length > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, limit);
}

/**
 * Calculate common interests between two students (for student profile view)
 */
export async function getCommonInterests(
  studentAId: string,
  studentBId: string
): Promise<{ commonInterests: MatchInterest[]; matchPercentage: number }> {
  const [interestsA, interestsB] = await Promise.all([
    prisma.studentInterest.findMany({
      where: { studentId: studentAId },
      include: { interest: { select: { id: true, name: true, icon: true } } },
    }),
    prisma.studentInterest.findMany({
      where: { studentId: studentBId },
      include: { interest: { select: { id: true, name: true, icon: true } } },
    }),
  ]);

  const setA = new Set(interestsA.map((si) => si.interestId));
  const setB = new Set(interestsB.map((si) => si.interestId));

  const commonInterests = interestsB
    .filter((si) => setA.has(si.interestId))
    .map((si) => ({
      id: si.interest.id,
      name: si.interest.name,
      icon: si.interest.icon,
    }));

  const unionSize = new Set([...setA, ...setB]).size;
  const matchPercentage = unionSize > 0 ? Math.round((commonInterests.length / unionSize) * 100) : 0;

  return { commonInterests, matchPercentage };
}
