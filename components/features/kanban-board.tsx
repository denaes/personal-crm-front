"use client"

import { useMemo } from "react"
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    DragOverEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    useDroppable,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanCard } from "./kanban-card"
import type { FeatureRequest } from "@/lib/hooks/use-feature-requests"
import { useState } from "react"
import {
    Lightbulb,
    Clock,
    CheckCircle2,
    Pause,
    XCircle,
    Play,
} from "lucide-react"

interface KanbanBoardProps {
    features: FeatureRequest[]
    updateStatus: (id: string, status: string) => Promise<void>
}

type FeatureStatus =
    | "proposed"
    | "under-review"
    | "planned"
    | "in-progress"
    | "completed"
    | "postponed"
    | "rejected"

type StatusConfig = {
    label: string
    icon: React.ComponentType<{ className?: string }>
    color: string
}

const statusConfig: Record<FeatureStatus, StatusConfig> = {
    proposed: {
        label: "Proposed",
        icon: Lightbulb,
        color: "border-blue-500/30 bg-blue-500/5",
    },
    "under-review": {
        label: "Under Review",
        icon: Clock,
        color: "border-yellow-500/30 bg-yellow-500/5",
    },
    planned: {
        label: "Planned",
        icon: CheckCircle2,
        color: "border-green-500/30 bg-green-500/5",
    },
    "in-progress": {
        label: "In Progress",
        icon: Play,
        color: "border-purple-500/30 bg-purple-500/5",
    },
    completed: {
        label: "Completed",
        icon: CheckCircle2,
        color: "border-green-600/30 bg-green-600/5",
    },
    postponed: {
        label: "Postponed",
        icon: Pause,
        color: "border-gray-500/30 bg-gray-500/5",
    },
    rejected: {
        label: "Rejected",
        icon: XCircle,
        color: "border-red-500/30 bg-red-500/5",
    },
}

export function KanbanBoard({ features, updateStatus }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [overId, setOverId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Reduced from 8 for more responsive dragging
            },
        })
    )

    const featuresByStatus = useMemo(() => {
        const grouped: Record<FeatureStatus, FeatureRequest[]> = {
            proposed: [],
            "under-review": [],
            planned: [],
            "in-progress": [],
            completed: [],
            postponed: [],
            rejected: [],
        }

        features.forEach((feature) => {
            const status = feature.status as FeatureStatus
            if (grouped[status]) {
                grouped[status].push(feature)
            }
        })

        return grouped
    }, [features])

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event
        setOverId(over ? (over.id as string) : null)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)
        setOverId(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        // Find which column the card was dropped in
        let targetStatus: FeatureStatus | null = null

        // Check if dropped directly on a column
        if (Object.keys(statusConfig).includes(overId)) {
            targetStatus = overId as FeatureStatus
        } else {
            // Dropped on another card, find which column that card belongs to
            const overFeature = features.find((f) => f.id === overId)
            if (overFeature) {
                targetStatus = overFeature.status as FeatureStatus
            }
        }

        if (targetStatus) {
            const feature = features.find((f) => f.id === activeId)
            if (feature && feature.status !== targetStatus) {
                try {
                    await updateStatus(activeId, targetStatus)
                } catch (error) {
                    console.error("Failed to update feature status:", error)
                }
            }
        }
    }

    const activeFeature = activeId
        ? features.find((f) => f.id === activeId)
        : null

    // Helper to determine if we're over a specific column
    const getTargetStatus = (id: string | null): FeatureStatus | null => {
        if (!id) return null
        if (Object.keys(statusConfig).includes(id)) {
            return id as FeatureStatus
        }
        const feature = features.find((f) => f.id === id)
        return feature ? (feature.status as FeatureStatus) : null
    }

    // Droppable column component with visual feedback
    const DroppableColumn = ({
        status,
        children,
        isOver
    }: {
        status: FeatureStatus
        children: React.ReactNode
        isOver: boolean
    }) => {
        const { setNodeRef } = useDroppable({
            id: status,
        })

        return (
            <div
                ref={setNodeRef}
                className={`h-full transition-all ${isOver ? 'scale-[1.02]' : ''}`}
            >
                {children}
            </div>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 h-full">
                {(Object.keys(statusConfig) as FeatureStatus[]).map((status) => {
                    const config = statusConfig[status]
                    const Icon = config.icon
                    const statusFeatures = featuresByStatus[status]
                    const targetStatus = getTargetStatus(overId)
                    const isOver = activeId !== null && targetStatus === status

                    return (
                        <DroppableColumn key={status} status={status} isOver={isOver}>
                            <SortableContext
                                id={status}
                                items={statusFeatures.map((f) => f.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div
                                    className={`flex flex-col rounded-lg border-2 ${config.color} p-3 min-h-[400px] h-full transition-all ${isOver ? 'border-primary/50 bg-primary/5 ring-2 ring-primary/20' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                                        <Icon className="w-4 h-4" />
                                        <h3 className="font-semibold text-sm">
                                            {config.label}
                                        </h3>
                                        <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                                            {statusFeatures.length}
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-2">
                                        {statusFeatures.map((feature) => (
                                            <KanbanCard
                                                key={feature.id}
                                                feature={feature}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </SortableContext>
                        </DroppableColumn>
                    )
                })}
            </div>
            <DragOverlay>
                {activeFeature ? (
                    <div className="opacity-80">
                        <KanbanCard feature={activeFeature} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
