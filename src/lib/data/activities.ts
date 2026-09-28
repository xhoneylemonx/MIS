"use server";

// Data Access Layer - Activities (PostgreSQL)
import { prisma } from "@/lib/prisma";

export interface ActivityData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  creatorId: string;
  createdAt: string;
  participants: { studentId: string }[];
  interests: { interestId: string }[];
}

function mapActivity(dbActivity: any): ActivityData {
  return {
    id: dbActivity.id,
    title: dbActivity.title,
    description: dbActivity.description,
    date: dbActivity.date,
    time: dbActivity.time,
    location: dbActivity.location,
    capacity: dbActivity.capacity,
    creatorId: dbActivity.creatorId,
    createdAt: dbActivity.createdAt?.toISOString?.() || dbActivity.createdAt,
    participants: dbActivity.participants || [],
    interests: dbActivity.interests || [],
  };
}

const includes = {
  participants: true,
  interests: true,
};

export async function getActivities(): Promise<ActivityData[]> {
  const activities = await prisma.activity.findMany({ include: includes });
  return activities.map(mapActivity);
}

export async function getActivityById(id: string): Promise<ActivityData | null> {
  const activity = await prisma.activity.findUnique({ where: { id }, include: includes });
  return activity ? mapActivity(activity) : null;
}

export async function getUpcomingActivities(): Promise<ActivityData[]> {
  const today = new Date().toISOString().split("T")[0];
  const activities = await prisma.activity.findMany({
    where: { date: { gte: today } },
    include: includes,
    orderBy: { date: "asc" },
  });
  return activities.map(mapActivity);
}

export async function searchActivities(query: string): Promise<ActivityData[]> {
  const q = query.toLowerCase().trim();
  if (!q) return getActivities();
  const activities = await prisma.activity.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    include: includes,
  });
  return activities.map(mapActivity);
}
