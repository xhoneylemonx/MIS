"use server";

// ============================================================
// Data Access Layer - Interests (PostgreSQL via Prisma)
// ============================================================

import { prisma } from "@/lib/prisma";

export interface InterestWithCategory {
  id: string;
  name: string;
  nameLower: string;
  icon: string;
  categoryId: string;
  isCustom: boolean;
  isActive: boolean;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export interface InterestCategoryData {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface LookingForOptionData {
  id: string;
  label: string;
  icon: string;
}

/**
 * Get all active interests with their categories
 */
export async function getInterests(): Promise<InterestWithCategory[]> {
  const interests = await prisma.interest.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { name: "asc" },
  });
  return interests as InterestWithCategory[];
}

/**
 * Get interests by IDs (for displaying student interests)
 */
export async function getInterestsByIds(ids: string[]): Promise<InterestWithCategory[]> {
  if (ids.length === 0) return [];
  const interests = await prisma.interest.findMany({
    where: { id: { in: ids }, isActive: true },
    include: { category: true },
  });
  return interests as InterestWithCategory[];
}

/**
 * Get all interest categories
 */
export async function getCategories(): Promise<InterestCategoryData[]> {
  return prisma.interestCategory.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string): Promise<InterestCategoryData | null> {
  return prisma.interestCategory.findUnique({ where: { id } });
}

/**
 * Get interests by category
 */
export async function getInterestsByCategory(categoryId: string): Promise<InterestWithCategory[]> {
  const interests = await prisma.interest.findMany({
    where: { categoryId, isActive: true },
    include: { category: true },
    orderBy: { name: "asc" },
  });
  return interests as InterestWithCategory[];
}

/**
 * Search interests by name (case-insensitive)
 */
export async function searchInterests(query: string): Promise<InterestWithCategory[]> {
  const q = query.trim();
  if (!q) return getInterests();
  const interests = await prisma.interest.findMany({
    where: {
      isActive: true,
      name: { contains: q, mode: "insensitive" },
    },
    include: { category: true },
    orderBy: { name: "asc" },
  });
  return interests as InterestWithCategory[];
}

/**
 * Get all looking-for options
 */
export async function getLookingForOptions(): Promise<LookingForOptionData[]> {
  return prisma.lookingForOption.findMany({
    orderBy: { label: "asc" },
  });
}

/**
 * Get interest by exact nameLower (for duplicate checking)
 */
export async function getInterestByNameLower(nameLower: string): Promise<InterestWithCategory | null> {
  const interest = await prisma.interest.findUnique({
    where: { nameLower },
    include: { category: true },
  });
  return interest as InterestWithCategory | null;
}
