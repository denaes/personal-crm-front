"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table/data-table"
import { columns, User } from "./columns"
import { api } from "@/lib/api-config"

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/v1/users')
                setUsers(response.data.data || response.data)
            } catch (error) {
                console.error("Failed to fetch users:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [])

    if (isLoading) {
        return <div>Loading users...</div>
    }

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">
                        Manage users and their roles.
                    </p>
                </div>
            </div>
            <DataTable data={users} columns={columns} filterColumn="email" filterPlaceholder="Filter emails..." />
        </div>
    )
}
