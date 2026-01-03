"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, ThumbsUp, User } from "lucide-react"
import type { FeatureRequest } from "@/lib/hooks/use-feature-requests"

interface KanbanCardProps {
    feature: FeatureRequest
}

const statusColors: Record<string, string> = {
    proposed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "under-review": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    planned: "bg-green-500/10 text-green-600 border-green-500/20",
    "in-progress": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    completed: "bg-green-600/10 text-green-700 border-green-600/20",
    postponed: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function KanbanCard({ feature }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: feature.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-3 mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${isDragging ? "shadow-xl ring-2 ring-primary" : ""
                }`}
        >
            <div className="flex items-start gap-2">
                <div className="mt-1 text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                        {feature.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {feature.description}
                    </p>

                    {feature.tags && feature.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {feature.tags.slice(0, 3).map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0 h-4"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {feature.tags.length > 3 && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0 h-4"
                                >
                                    +{feature.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">
                                {feature.creator.displayName || feature.creator.email}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{feature.upvotes}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
