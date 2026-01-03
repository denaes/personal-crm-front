"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { format } from "date-fns"
import { AuditLogResponseDto } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<AuditLogResponseDto>[] = [
    {
        accessorKey: "actor",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Actor" />
        ),
        cell: ({ row }) => <div className="font-medium text-sm">{row.getValue("actor")}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "action",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Action" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline" className="text-xs font-normal">
                {row.getValue("action")}
            </Badge>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "entityType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Entity" />
        ),
        cell: ({ row }) => {
            const type = row.getValue("entityType") as string
            const id = row.original.entityId
            if (!type) return <span className="text-muted-foreground">-</span>
            return (
                <div className="flex flex-col text-xs">
                    <span className="font-medium">{type}</span>
                    <span className="text-muted-foreground text-[10px] truncate max-w-[100px]" title={id}>{id}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "metadata",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Metadata" />
        ),
        cell: ({ row }) => {
            const metadata = row.getValue("metadata") as Record<string, any>
            if (!metadata) return <span className="text-muted-foreground">-</span>
            return (
                <pre className="text-[10px] text-muted-foreground max-w-[200px] overflow-hidden whitespace-pre-wrap">
                    {JSON.stringify(metadata, null, 1).slice(0, 100)}
                    {JSON.stringify(metadata).length > 100 && "..."}
                </pre>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (
            <div className="text-xs text-muted-foreground">
                {format(new Date(row.getValue("createdAt")), "PP p")}
            </div>
        ),
    },
]
