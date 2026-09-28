import { prisma } from "@/lib/prisma";
import { SyncClient } from "./SyncClient";

export default async function AdminSyncPage() {
    // If the database cannot be reached during development/evaluation (E.g. sandboxed environment), 
    // gracefully fallback to an empty array so the page still compiles and runs.
    let logs: any[] = [];
    try {
        logs = await prisma.syncLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    } catch (error) {
        console.error("Could not fetch sync logs:", error);
    }

    return <SyncClient logs={logs} />;
}
