"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Plus, X } from "lucide-react"
import { useState } from "react"

export type FeatureRequest = {
    id: string
    title: string
    description: string
    status: string
    upvotes: number
    tags: string[]
    creator: {
        email: string
        displayName: string
    }
    createdAt: string
}

const TagsCell = ({ row, updateTags }: { row: { getValue: (key: string) => any; original: FeatureRequest }, updateTags: (id: string, tags: string[]) => Promise<void> }) => {
    const tags = (row.getValue("tags") || []) as string[]
    const [isUpdating, setIsUpdating] = useState(false)
    const [newTag, setNewTag] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleRemoveTag = async (tagToRemove: string) => {
        const updatedTags = tags.filter(t => t !== tagToRemove)
        setIsUpdating(true)
        try {
            await updateTags(row.original.id, updatedTags)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleAddTag = async () => {
        if (!newTag.trim()) return
        const updatedTags = [...tags, newTag.trim()]
        setIsUpdating(true)
        try {
            await updateTags(row.original.id, updatedTags)
            setNewTag("")
            setIsOpen(false)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="flex flex-wrap gap-1 items-center max-w-[200px]">
            {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs px-1 py-0 h-5 gap-1">
                    {tag}
                    <button
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isUpdating}
                        className="hover:bg-muted rounded-full p-0.5"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </Badge>
            ))}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="h-5 w-5 rounded-full p-0">
                        <Plus className="w-3 h-3" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                    <div className="flex gap-2">
                        <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="New tag..."
                            className="h-8 text-xs"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddTag()
                            }}
                        />
                        <Button size="sm" className="h-8 px-2" onClick={handleAddTag} disabled={isUpdating}>
                            Add
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

const StatusCell = ({ row, updateStatus }: { row: { getValue: (key: string) => any; original: FeatureRequest }, updateStatus: (id: string, status: string) => Promise<void> }) => {
    const status = row.getValue("status") as string
    const [isUpdating, setIsUpdating] = useState(false)

    const onValueChange = async (newStatus: string) => {
        if (newStatus === status) return;
        setIsUpdating(true)
        try {
            await updateStatus(row.original.id, newStatus)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Select defaultValue={status} onValueChange={onValueChange} disabled={isUpdating}>
            <SelectTrigger className="w-[130px] h-8">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="proposed">Proposed</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="postponed">Postponed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
        </Select>
    )
}

export const getColumns = (
    updateStatus: (id: string, status: string) => Promise<void>,
    updateTags: (id: string, tags: string[]) => Promise<void>
): ColumnDef<FeatureRequest>[] => [
        {
            accessorKey: "title",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Title" />
            ),
            cell: ({ row }) => (
                <div className="flex flex-col max-w-[200px]">
                    <span className="font-medium truncate" title={row.getValue("title")}>{row.getValue("title")}</span>
                    <span className="text-xs text-muted-foreground truncate" title={row.original.description}>{row.original.description}</span>
                </div>
            )
        },
        {
            accessorKey: "description",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Description" />
            ),
            cell: ({ row }) => <div className="text-sm text-muted-foreground truncate max-w-[300px]" title={row.getValue("description")}>{row.getValue("description")}</div>
        },
        {
            accessorKey: "tags",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Tags" />
            ),
            cell: ({ row }) => <TagsCell row={row} updateTags={updateTags} />,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => <StatusCell row={row} updateStatus={updateStatus} />,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "upvotes",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Votes" />
            ),
            cell: ({ row }) => <div className="text-center w-12">{row.getValue("upvotes")}</div>
        },
        {
            accessorKey: "creator.email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Creator" />
            ),
            cell: ({ row }) => <div className="text-sm text-muted-foreground max-w-[150px] truncate" title={row.original.creator.email}>{row.original.creator.email}</div>
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created" />
            ),
            cell: ({ row }) => <div className="text-xs">{format(new Date(row.getValue("createdAt")), "PP")}</div>,
        },
    ]
