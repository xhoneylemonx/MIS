"use client";

import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
    addInterestToStudent,
    removeInterestFromStudent,
    createCustomInterest,
    toggleLookingFor,
    updateBio,
} from "@/lib/actions";
import { InterestWithCategory, InterestCategoryData, LookingForOptionData } from "@/lib/data/interests";
import { StudentData } from "@/lib/data/students";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
    allStudents: StudentData[];
    allInterests: InterestWithCategory[];
    allCategories: InterestCategoryData[];
    lookingForOptions: LookingForOptionData[];
}

export function ProfileClient({
    allStudents,
    allInterests,
    allCategories,
    lookingForOptions,
}: ProfileClientProps) {
    const { user } = useAuth();
    const router = useRouter();

    const student = useMemo(() => {
        if (!user?.studentId) return null;
        return allStudents.find((s) => s.id === user.studentId) || null;
    }, [user, allStudents]);

    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState(student?.bio || "");
    const [searchInterest, setSearchInterest] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [localInterestIds, setLocalInterestIds] = useState<string[]>(student?.interestIds || []);
    const [localLookingForIds, setLocalLookingForIds] = useState<string[]>(student?.lookingForIds || []);

    const showSuccess = useCallback((msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    }, []);

    if (!student) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <span className="text-4xl block mb-4">👤</span>
                <p className="text-lg font-semibold">ไม่พบข้อมูลโปรไฟล์</p>
                <p className="text-sm mt-2">กรุณา Login ใหม่อีกครั้ง</p>
            </div>
        );
    }

    const myInterests = allInterests.filter((i) => localInterestIds.includes(i.id));
    const myLookingFor = lookingForOptions.filter((lf) => localLookingForIds.includes(lf.id));

    const filteredInterests = allInterests.filter((i) => {
        if (searchInterest && !i.name.toLowerCase().includes(searchInterest.toLowerCase())) return false;
        if (selectedCategory !== "all" && i.categoryId !== selectedCategory) return false;
        return true;
    });

    // Check if search query has no exact match (for custom interest creation)
    const searchQuery = searchInterest.trim();
    const searchHasExactMatch = searchQuery
        ? allInterests.some((i) => i.name.toLowerCase() === searchQuery.toLowerCase())
        : true;

    const handleAddInterest = async (interestId: string) => {
        setLoading(true);
        setLocalInterestIds((prev) => [...prev, interestId]);
        const result = await addInterestToStudent(student.id, interestId);
        if (result.success) {
            showSuccess("เพิ่ม Interest สำเร็จ");
            router.refresh();
        } else {
            setLocalInterestIds((prev) => prev.filter((id) => id !== interestId));
        }
        setLoading(false);
    };

    const handleRemoveInterest = async (interestId: string) => {
        setLoading(true);
        setLocalInterestIds((prev) => prev.filter((id) => id !== interestId));
        const result = await removeInterestFromStudent(student.id, interestId);
        if (result.success) {
            showSuccess("ลบ Interest สำเร็จ");
            router.refresh();
        } else {
            setLocalInterestIds((prev) => [...prev, interestId]);
        }
        setLoading(false);
    };

    const handleCreateCustomInterest = async () => {
        if (!searchQuery) return;
        const categoryId = selectedCategory !== "all" ? selectedCategory : allCategories.find((c) => c.name === "Other")?.id;
        if (!categoryId) return;

        setLoading(true);
        const result = await createCustomInterest(student.id, searchQuery, categoryId);
        if (result.success) {
            showSuccess(`สร้าง "${searchQuery}" สำเร็จ`);
            setSearchInterest("");
            router.refresh();
        } else {
            showSuccess(result.error || "ไม่สามารถสร้างได้");
        }
        setLoading(false);
    };

    const handleToggleLookingFor = async (lfId: string) => {
        if (!isEditing) return;
        setLoading(true);
        const wasSelected = localLookingForIds.includes(lfId);
        setLocalLookingForIds((prev) =>
            wasSelected ? prev.filter((id) => id !== lfId) : [...prev, lfId]
        );
        const result = await toggleLookingFor(student.id, lfId);
        if (result.success) {
            showSuccess(wasSelected ? "ลบสิ่งที่กำลังหาสำเร็จ" : "เพิ่มสิ่งที่กำลังหาสำเร็จ");
            router.refresh();
        } else {
            setLocalLookingForIds((prev) =>
                wasSelected ? [...prev, lfId] : prev.filter((id) => id !== lfId)
            );
        }
        setLoading(false);
    };

    const handleSaveBio = async () => {
        setLoading(true);
        const result = await updateBio(student.id, editBio);
        if (result.success) {
            setIsEditing(false);
            showSuccess("บันทึก Bio สำเร็จ");
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {successMsg && (
                <div className="fixed top-4 right-4 lg:top-8 lg:right-8 bg-green-50 text-primary border border-primary/20 px-4 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-top">
                    ✅ {successMsg}
                </div>
            )}

            {/* Profile Header */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="gradient-primary h-32" />
                <div className="p-6 -mt-12">
                    <div className="flex items-end gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-card shadow-lg flex items-center justify-center text-2xl font-bold gradient-primary text-white border-4 border-white">
                            {getInitials(student.name)}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold">{student.name}</h1>
                            <p className="text-sm text-muted-foreground">
                                {student.faculty} · {student.program} · รหัส {student.year}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">ID: {student.studentId}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isEditing ? "bg-muted text-muted-foreground" : "bg-primary text-white hover:bg-primary/90"}`}
                        >
                            {isEditing ? "✕ ปิดแก้ไข" : "✏️ แก้ไข"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Official Student Info (read-only) */}
            <div className="bg-background/50 rounded-xl border border-slate-200 p-6">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    📋 ข้อมูลนักศึกษา (จากระบบทะเบียน)
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">รหัสนักศึกษา</p>
                        <p className="text-sm font-medium text-foreground">{student.studentId}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">ชื่อ</p>
                        <p className="text-sm font-medium text-foreground">{student.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">คณะ</p>
                        <p className="text-sm font-medium text-foreground">{student.faculty}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">สาขา</p>
                        <p className="text-sm font-medium text-foreground">{student.program}</p>
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 italic">ℹ️ ข้อมูลส่วนนี้มาจากระบบทะเบียน ไม่สามารถแก้ไขได้</p>
            </div>

            {/* Bio */}
            <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-3">📝 Bio</h2>
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            rows={3}
                            maxLength={500}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            placeholder="เขียนแนะนำตัวเอง..."
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{editBio.length}/500</span>
                            <button
                                onClick={handleSaveBio}
                                disabled={loading}
                                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">{student.bio || "ยังไม่มี Bio"}</p>
                )}
            </div>

            {/* Interests */}
            <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">✨ ความสนใจ ({localInterestIds.length})</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                    {myInterests.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">ยังไม่ได้เลือก Interest</p>
                    ) : (
                        myInterests.map((interest) => (
                            <span
                                key={interest.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                            >
                                {interest.icon} {interest.name}
                                {isEditing && (
                                    <button
                                        onClick={() => handleRemoveInterest(interest.id)}
                                        disabled={loading}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                )}
                            </span>
                        ))
                    )}
                </div>

                {isEditing && (
                    <div className="border-t border-border pt-4 space-y-4">
                        <p className="text-sm font-medium">เพิ่ม Interest</p>
                        <input
                            type="text"
                            placeholder="ค้นหา interest..."
                            value={searchInterest}
                            onChange={(e) => setSearchInterest(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                        <div className="flex flex-wrap gap-2 mb-3">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedCategory === "all" ? "bg-primary text-white" : "bg-accent"}`}
                            >
                                ทั้งหมด
                            </button>
                            {allCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedCategory === cat.id ? "bg-primary text-white" : "bg-accent"}`}
                                >
                                    {cat.icon} {cat.name}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                            {filteredInterests
                                .filter((i) => !localInterestIds.includes(i.id))
                                .map((interest) => (
                                    <button
                                        key={interest.id}
                                        onClick={() => handleAddInterest(interest.id)}
                                        disabled={loading}
                                        className="px-3 py-1.5 rounded-full text-xs bg-accent hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50"
                                    >
                                        {interest.icon} {interest.name}
                                    </button>
                                ))}
                        </div>

                        {/* Create custom interest */}
                        {searchQuery && !searchHasExactMatch && (
                            <button
                                onClick={handleCreateCustomInterest}
                                disabled={loading}
                                className="mt-2 px-4 py-2 rounded-xl bg-green-50 text-primary border border-primary/20 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                            >
                                ➕ สร้าง &quot;{searchQuery}&quot;
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Looking For */}
            <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">🎯 กำลังหา</h2>
                <div className="flex flex-wrap gap-2">
                    {lookingForOptions.map((lf) => {
                        const isSelected = localLookingForIds.includes(lf.id);
                        return (
                            <button
                                key={lf.id}
                                onClick={() => handleToggleLookingFor(lf.id)}
                                disabled={!isEditing || loading}
                                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${isSelected
                                    ? "bg-primary/10 text-primary font-medium"
                                    : isEditing
                                        ? "bg-accent hover:bg-accent/80 text-muted-foreground cursor-pointer"
                                        : "bg-accent text-muted-foreground cursor-default opacity-50"
                                    }`}
                            >
                                {lf.icon} {lf.label}
                            </button>
                        );
                    })}
                </div>
                {!isEditing && myLookingFor.length === 0 && (
                    <p className="text-sm text-muted-foreground italic mt-2">ยังไม่ได้เลือก</p>
                )}
            </div>
        </div>
    );
}
