"use client"

import { useState, useMemo, useCallback } from "react"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getColumns } from "./columns"
import { useFeatureRequests, useUpdateFeatureRequest } from "@/lib/hooks/use-feature-requests"
import { KanbanBoard } from "@/components/features/kanban-board"
import { Button } from "@/components/ui/button"
import {
    Lightbulb,
    Clock,
    CheckCircle2,
    Pause,
    XCircle,
    Loader2,
    AlertCircle,
    LayoutGrid,
    List,
} from "lucide-react"

export default function FeaturesPage() {
    const [viewMode, setViewMode] = useState<"table" | "board">("table")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const { data: features = [], isLoading, error } = useFeatureRequests(
        selectedStatus === "all" ? undefined : selectedStatus,
        undefined,
        "newest",
        "DESC"
    )
    const updateFeatureMutation = useUpdateFeatureRequest()

    const statuses = [
        { id: "all", label: "All", icon: Lightbulb },
        { id: "proposed", label: "Proposed", icon: Lightbulb },
        { id: "under-review", label: "Under Review", icon: Clock },
        { id: "planned", label: "Planned", icon: CheckCircle2 },
        { id: "in-progress", label: "In Progress", icon: Clock },
        { id: "completed", label: "Completed", icon: CheckCircle2 },
        { id: "postponed", label: "Postponed", icon: Pause },
        { id: "rejected", label: "Rejected", icon: XCircle },
    ];

    const updateStatus = useCallback(async (id: string, status: string) => {
        try {
            // @ts-expect-error - status type mismatch between string and literal type in generated DTO
            await updateFeatureMutation.mutateAsync({ id, data: { status } })
        } catch (error) {
            console.error("Failed to update status:", error)
            alert("Failed to update status")
        }
    }, [updateFeatureMutation])

    const updateTags = useCallback(async (id: string, tags: string[]) => {
        try {
            await updateFeatureMutation.mutateAsync({ id, data: { tags } })
        } catch (error) {
            console.error("Failed to update tags:", error)
            alert("Failed to update tags")
        }
    }, [updateFeatureMutation])

    // Always call getColumns to maintain consistent hook order
    const columns = useMemo(() => getColumns(updateStatus, updateTags), [updateStatus, updateTags])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading features...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-destructive">
                <AlertCircle className="w-8 h-8 mb-4" />
                <p>Failed to load features.</p>
            </div>
        )
    }

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Feature Requests</h2>
                    <p className="text-muted-foreground">
                        Manage feature requests and update statuses.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === "table" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className="gap-2"
                    >
                        <List className="w-4 h-4" />
                        Table
                    </Button>
                    <Button
                        variant={viewMode === "board" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("board")}
                        className="gap-2"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Board
                    </Button>
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {statuses.map((status) => {
                    const Icon = status.icon;
                    return (
                        <button
                            key={status.id}
                            onClick={() => setSelectedStatus(status.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all border ${selectedStatus === status.id
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background hover:bg-muted border-border text-muted-foreground"
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {status.label}
                        </button>
                    );
                })}
            </div>

            <div className={viewMode === "table" ? "block" : "hidden"}>
                <DataTable
                    data={features}
                    columns={columns}
                    filterColumn="title"
                    filterPlaceholder="Filter titles..."
                />
            </div>
            <div className={viewMode === "board" ? "block" : "hidden"}>
                <KanbanBoard
                    features={features}
                    updateStatus={updateStatus}
                />
            </div>
        </div>
    )
}
