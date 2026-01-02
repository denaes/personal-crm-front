"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/lib/api-config"
import { getInitials } from "@/lib/utils"

export type User = {
    id: string
    email: string
    name: string
    googleId: string
    role: string
    photoUrl?: string
    createdAt: string
    updatedAt: string
}

const RoleCell = ({ user }: { user: User }) => {
    const [role, setRole] = useState(user.role)
    const [isLoading, setIsLoading] = useState(false)

    const onRoleChange = async (newRole: string) => {
        try {
            setIsLoading(true)
            await api.put(`/api/v1/users/${user.id}/role`, { role: newRole })
            setRole(newRole)
        } catch (error) {
            console.error("Failed to update role:", error)
            alert("Failed to update role")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Select value={role} onValueChange={onRoleChange} disabled={isLoading}>
            <SelectTrigger className="w-[100px] h-8">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
        </Select>
    )
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "photoUrl",
        header: "",
        cell: ({ row }) => {
            const user = row.original
            return (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoUrl} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => <RoleCell user={row.original} />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "googleId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Google ID" />
        ),
        cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("googleId")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => <div className="text-xs">{format(new Date(row.getValue("createdAt")), "PP p")}</div>,
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Updated" />
        ),
        cell: ({ row }) => <div className="text-xs">{format(new Date(row.getValue("updatedAt")), "PP p")}</div>,
    },
]
