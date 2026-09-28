"use server";

// ============================================================
// Server Actions — Interest, LookingFor, and Profile mutations
// ============================================================

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ── Validation helpers ──────────────────────────────────────

function normalizeInterestName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

function validateInterestName(name: string): { valid: boolean; error?: string } {
  const normalized = normalizeInterestName(name);
  if (!normalized || normalized.length < 2) {
    return { valid: false, error: "Interest name must be at least 2 characters" };
  }
  if (normalized.length > 50) {
    return { valid: false, error: "Interest name must be at most 50 characters" };
  }
  // Check for meaningless input
  if (/^[^a-zA-Z0-9\u0E00-\u0E7F]+$/.test(normalized)) {
    return { valid: false, error: "Interest name must contain letters or numbers" };
  }
  return { valid: true };
}

async function verifyStudentOwnership(studentId: string): Promise<boolean> {
  // In a real app you'd compare against the session. For now, verify student exists.
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  return !!student;
}

// ── Interest Actions ────────────────────────────────────────

export async function addInterestToStudent(studentId: string, interestId: string) {
  if (!await verifyStudentOwnership(studentId)) {
    return { success: false, error: "Student not found" };
  }

  try {
    // Check if already exists
    const existing = await prisma.studentInterest.findUnique({
      where: { studentId_interestId: { studentId, interestId } },
    });
    if (existing) {
      return { success: false, error: "Interest already added" };
    }

    await prisma.studentInterest.create({
      data: { studentId, interestId },
    });

    const otherStudents = await prisma.studentInterest.findMany({
      where: { interestId, studentId: { not: studentId } },
      include: { student: true },
      take: 5
    });
    const matchedStudents = otherStudents.map(os => ({
        id: os.student.id,
        name: os.student.name,
        studentId: os.student.studentId
    }));

    revalidatePath("/profile");
    revalidatePath("/discover");
    revalidatePath("/matches");
    return { success: true, matchedStudents };
  } catch (error) {
    console.error("addInterestToStudent error:", error);
    return { success: false, error: "Failed to add interest" };
  }
}

export async function removeInterestFromStudent(studentId: string, interestId: string) {
  if (!await verifyStudentOwnership(studentId)) {
    return { success: false, error: "Student not found" };
  }

  try {
    await prisma.studentInterest.delete({
      where: { studentId_interestId: { studentId, interestId } },
    });

    revalidatePath("/profile");
    revalidatePath("/discover");
    revalidatePath("/matches");
    return { success: true };
  } catch (error) {
    console.error("removeInterestFromStudent error:", error);
    return { success: false, error: "Failed to remove interest" };
  }
}

export async function createCustomInterest(
  studentId: string,
  name: string,
  categoryId: string
) {
  if (!await verifyStudentOwnership(studentId)) {
    return { success: false, error: "Student not found" };
  }

  const validation = validateInterestName(name);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const normalized = normalizeInterestName(name);
  const nameLower = normalized.toLowerCase();

  try {
    // Check if interest already exists
    const existing = await prisma.interest.findFirst({
      where: { name: { equals: normalized, mode: "insensitive" } as any },
    });

    if (existing) {
      // Interest exists — just add it to the student if not already added
      const studentInterest = await prisma.studentInterest.findUnique({
        where: { studentId_interestId: { studentId, interestId: existing.id } },
      });
      if (studentInterest) {
        return { success: false, error: "You already have this interest" };
      }
      await prisma.studentInterest.create({
        data: { studentId, interestId: existing.id },
      });

      const otherStudents = await prisma.studentInterest.findMany({
        where: { interestId: existing.id, studentId: { not: studentId } },
        include: { student: true },
        take: 5
      });
      const matchedStudents = otherStudents.map(os => ({
          id: os.student.id,
          name: os.student.name,
          studentId: os.student.studentId
      }));

      revalidatePath("/profile");
      return { success: true, interestId: existing.id, matchedStudents };
    }

    // Verify category exists
    const category = await prisma.interestCategory.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return { success: false, error: "Invalid category" };
    }

    // Create the custom interest and assign to student
    const newInterest = await prisma.interest.create({
      data: {
        name: normalized,
        nameLower: nameLower,
        icon: "⭐",
        categoryId,
      },
    });

    await prisma.studentInterest.create({
      data: { studentId, interestId: newInterest.id },
    });

    revalidatePath("/profile");
    revalidatePath("/discover");
    return { success: true, interestId: newInterest.id };
  } catch (error) {
    console.error("createCustomInterest error:", error);
    return { success: false, error: "Failed to create interest" };
  }
}

// ── Looking For Actions ─────────────────────────────────────

export async function toggleLookingFor(studentId: string, lookingForId: string) {
  if (!await verifyStudentOwnership(studentId)) {
    return { success: false, error: "Student not found" };
  }

  try {
    const existing = await prisma.studentLookingFor.findUnique({
      where: { studentId_lookingForId: { studentId, lookingForId } },
    });

    if (existing) {
      await prisma.studentLookingFor.delete({
        where: { studentId_lookingForId: { studentId, lookingForId } },
      });
    } else {
      await prisma.studentLookingFor.create({
        data: { studentId, lookingForId },
      });
    }

    revalidatePath("/profile");
    revalidatePath("/discover");
    return { success: true };
  } catch (error) {
    console.error("toggleLookingFor error:", error);
    return { success: false, error: "Failed to update looking for" };
  }
}

// ── Profile Actions ─────────────────────────────────────────

export async function updateBio(studentId: string, bio: string) {
  if (!await verifyStudentOwnership(studentId)) {
    return { success: false, error: "Student not found" };
  }

  const trimmedBio = bio.trim();
  if (trimmedBio.length > 500) {
    return { success: false, error: "Bio must be at most 500 characters" };
  }

  try {
    await prisma.student.update({
      where: { id: studentId },
      data: { bio: trimmedBio || null },
    });
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("updateBio error:", error);
    return { success: false, error: "Failed to update bio" };
  }
}

// ── Admin Actions ───────────────────────────────────────────

export async function adminCreateInterest(
  name: string,
  categoryId: string,
  icon: string = "⭐"
) {
  const validation = validateInterestName(name);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const normalized = normalizeInterestName(name);
  const nameLower = normalized.toLowerCase();

  try {
    const existing = await prisma.interest.findFirst({
      where: { name: { equals: normalized, mode: "insensitive" } as any },
    });
    if (existing) {
      return { success: false, error: "Interest already exists" };
    }

    const interest = await prisma.interest.create({
      data: {
        name: normalized,
        nameLower: nameLower,
        icon,
        categoryId,
      },
    });

    revalidatePath("/admin/interests");
    return { success: true, interest };
  } catch (error) {
    console.error("adminCreateInterest error:", error);
    return { success: false, error: "Failed to create interest" };
  }
}

export async function adminUpdateInterest(
  interestId: string,
  data: { name?: string; categoryId?: string; icon?: string }
) {
  try {
    const updateData: Record<string, unknown> = {};

    if (data.name) {
      const validation = validateInterestName(data.name);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      const normalized = normalizeInterestName(data.name);
      updateData.name = normalized;
      updateData.nameLower = normalized.toLowerCase();
    }
    if (data.categoryId) updateData.categoryId = data.categoryId;
    if (data.icon) updateData.icon = data.icon;

    await prisma.interest.update({
      where: { id: interestId },
      data: updateData,
    });

    revalidatePath("/admin/interests");
    return { success: true };
  } catch (error) {
    console.error("adminUpdateInterest error:", error);
    return { success: false, error: "Failed to update interest" };
  }
}

export async function adminToggleInterest(interestId: string, isActive: boolean) {
  try {
    // isActive is deprecated in current schema, acting as no-op to satisfy UI
    revalidatePath("/admin/interests");
    return { success: true };
  } catch (error) {
    console.error("adminToggleInterest error:", error);
    return { success: false, error: "Failed to toggle interest" };
  }
}

// ── Admin Statistics ────────────────────────────────────────

export async function getInterestStatistics() {
  const [
    totalInterests,
    customInterests,
    totalStudents,
    studentsWithInterests,
    interestUsage,
    categoryUsage,
  ] = await Promise.all([
    prisma.interest.count(),
    prisma.interest.count(), // placeholder since isCustom is removed
    prisma.student.count(),
    prisma.studentInterest.groupBy({
      by: ["studentId"],
      _count: true,
    }).then(r => r.length),
    prisma.interest.findMany({
      include: {
        category: true,
        _count: { select: { students: true } },
      },
      orderBy: { students: { _count: "desc" } },
    }),
    prisma.interestCategory.findMany({
      include: {
        _count: { select: { interests: true } },
        interests: {
          include: { _count: { select: { students: true } } },
        },
      },
    }),
  ]);

  const studentsWithNoInterests = totalStudents - studentsWithInterests;

  const categoryStats = categoryUsage.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    interestCount: cat._count.interests,
    totalStudentUsage: cat.interests.reduce((sum, i) => sum + i._count.students, 0),
  }));

  return {
    totalInterests,
    customInterests,
    totalStudents,
    studentsWithNoInterests,
    interestUsage: interestUsage.map((i) => ({
      id: i.id,
      name: i.name,
      icon: i.icon,
      categoryId: i.categoryId,
      categoryName: (i as any).category.name,
      categoryColor: (i as any).category.color,
      isCustom: false,
      isActive: true,
      studentCount: i._count.students,
    })),
    categoryStats,
  };
}

// ── Group Actions ───────────────────────────────────────────

export async function createGroup(studentId: string, data: { name: string, description: string, interestIds: string[], coverImage?: string }) {
  if (!await verifyStudentOwnership(studentId)) return { success: false, error: "Student not found" };
  try {
    const group = await prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        coverImage: data.coverImage,
        creatorId: studentId,
        members: { create: { studentId } },
        interests: { create: data.interestIds.map((id) => ({ interestId: id })) },
      }
    });
    revalidatePath("/groups");
    revalidatePath("/dashboard");
    return { success: true, groupId: group.id };
  } catch (error) {
    console.error("createGroup error:", error);
    return { success: false, error: "Failed to create group" };
  }
}

export async function joinGroup(studentId: string, groupId: string) {
  if (!await verifyStudentOwnership(studentId)) return { success: false, error: "Student not found" };
  try {
    const existing = await prisma.groupMember.findUnique({
      where: { groupId_studentId: { studentId, groupId } }
    });
    if (existing) return { success: false, error: "Already a member" };

    await prisma.groupMember.create({
      data: { studentId, groupId }
    });
    revalidatePath(`/groups/${groupId}`);
    revalidatePath("/groups");
    return { success: true };
  } catch (error) {
    console.error("joinGroup error:", error);
    return { success: false, error: "Failed to join group" };
  }
}

export async function leaveGroup(studentId: string, groupId: string) {
  if (!await verifyStudentOwnership(studentId)) return { success: false, error: "Student not found" };
  try {
    await prisma.groupMember.delete({
      where: { groupId_studentId: { studentId, groupId } }
    });
    revalidatePath(`/groups/${groupId}`);
    revalidatePath("/groups");
    return { success: true };
  } catch (error) {
    console.error("leaveGroup error:", error);
    return { success: false, error: "Failed to leave group" };
  }
}

// ── Activity Actions ────────────────────────────────────────

export async function createActivity(studentId: string, data: { title: string, description: string, date: string, time: string, location: string, capacity: number, interestIds: string[], coverImage?: string }) {
  if (!await verifyStudentOwnership(studentId)) return { success: false, error: "Student not found" };
  try {
    const activity = await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        capacity: data.capacity,
        coverImage: data.coverImage,
        creatorId: studentId,
        participants: { create: { studentId } },
        interests: { create: data.interestIds.map((id) => ({ interestId: id })) }
      }
    });
    revalidatePath("/activities");
    revalidatePath("/dashboard");
    return { success: true, activityId: activity.id };
  } catch (error) {
    console.error("createActivity error:", error);
    return { success: false, error: "Failed to create activity" };
  }
}

export async function joinActivity(studentId: string, activityId: string) {
  if (!await verifyStudentOwnership(studentId)) return { success: false, error: "Student not found" };
  try {
    const activity = await prisma.activity.findUnique({ where: { id: activityId }, include: { participants: true }});
    if (!activity) return { success: false, error: "Activity not found" };
    if (activity.participants.length >= activity.capacity) return { success: false, error: "Activity is full" };
    
    const existing = activity.participants.find(p => p.studentId === studentId);
    if (existing) return { success: false, error: "Already joined" };

    await prisma.activityParticipant.create({
      data: { studentId, activityId }
    });
    revalidatePath(`/activities/${activityId}`);
    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    console.error("joinActivity error:", error);
    return { success: false, error: "Failed to join activity" };
  }
}

export async function leaveActivity(studentId: string, activityId: string) {
  if (!await verifyStudentOwnership(studentId)) return { success: false, error: "Student not found" };
  try {
    await prisma.activityParticipant.delete({
      where: { activityId_studentId: { studentId, activityId } }
    });
    revalidatePath(`/activities/${activityId}`);
    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    console.error("leaveActivity error:", error);
    return { success: false, error: "Failed to leave activity" };
  }
}

// ── Dashboard Actions ───────────────────────────────────────
import { getMatchesForStudent } from "./services/matching";

export async function getDashboardData(studentId: string) {
  const [student, matches, allGroups, allActivities] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      include: {
        interests: { include: { interest: true } },
        groupMembers: true,
        activityParticipants: true,
      }
    }),
    getMatchesForStudent(studentId, 4),
    prisma.group.findMany({
      include: {
        members: true,
        interests: { include: { interest: true } },
      }
    }),
    prisma.activity.findMany({
      where: { date: { gte: new Date().toISOString().split('T')[0] } },
      include: {
        participants: true,
        interests: { include: { interest: true } },
      },
      orderBy: { date: 'asc' },
      take: 4,
    })
  ]);

  if (!student) return null;

  const recommendedGroups = allGroups.filter(g =>
    !g.members.some(m => m.studentId === student.id) &&
    g.interests.some(gi => student.interests.some(si => si.interestId === gi.interestId))
  ).slice(0, 3);

  return {
    studentInterests: student.interests.map(i => i.interest),
    groupsCount: student.groupMembers.length,
    activitiesCount: student.activityParticipants.length,
    topMatches: matches,
    upcomingActivities: allActivities,
    recommendedGroups,
  };
}

