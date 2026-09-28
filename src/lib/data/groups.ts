"use server";

// Data Access Layer - Groups (PostgreSQL)
import { prisma } from "@/lib/prisma";

export interface GroupData {
  id: string;
  name: string;
  description: string;
  coverImage?: string | null;
  creatorId: string;
  createdAt: string;
  members: { studentId: string }[];
  interests: { interestId: string }[];
}

function mapGroup(dbGroup: any): GroupData {
  return {
    id: dbGroup.id,
    name: dbGroup.name,
    description: dbGroup.description,
    coverImage: dbGroup.coverImage,
    creatorId: dbGroup.creatorId,
    createdAt: dbGroup.createdAt?.toISOString?.() || dbGroup.createdAt,
    members: dbGroup.members || [],
    interests: dbGroup.interests || [],
  };
}

const includes = {
  members: true,
  interests: true,
};

export async function getGroups(): Promise<GroupData[]> {
  const groups = await prisma.group.findMany({ include: includes });
  return groups.map(mapGroup);
}

export async function getGroupById(id: string): Promise<GroupData | null> {
  const group = await prisma.group.findUnique({ where: { id }, include: includes });
  return group ? mapGroup(group) : null;
}

export async function getGroupsByMember(studentId: string): Promise<GroupData[]> {
  const groups = await prisma.group.findMany({
    where: { members: { some: { studentId } } },
    include: includes,
  });
  return groups.map(mapGroup);
}

export async function searchGroups(query: string): Promise<GroupData[]> {
  const q = query.toLowerCase().trim();
  if (!q) return getGroups();
  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    include: includes,
  });
  return groups.map(mapGroup);
}
