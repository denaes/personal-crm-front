"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getColumns, FeatureRequest } from "./columns" // Import getColumns factory
import { api } from "@/lib/api-config"

export default function FeaturesPage() {
    const [features, setFeatures] = useState<FeatureRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchFeatures = async () => {
        try {
            // Fetch all features, sorting by newest usually good for admin
            const response = await api.get('/api/v1/feature-requests?sortBy=newest&status=all')
            setFeatures(response.data.data || response.data)
        } catch (error) {
            console.error("Failed to fetch features:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchFeatures()
    }, [])

    const updateStatus = useCallback(async (id: string, status: string) => {
        try {
            await api.put(`/api/v1/feature-requests/${id}`, { status })
            // Optimistic update or refetch
            setFeatures(prev => prev.map(f => f.id === id ? { ...f, status } : f))
        } catch (error) {
            console.error("Failed to update status:", error)
            alert("Failed to update status")
        }
    }, [])

    const updateTags = useCallback(async (id: string, tags: string[]) => {
        try {
            await api.put(`/api/v1/feature-requests/${id}`, { tags })
            setFeatures(prev => prev.map(f => f.id === id ? { ...f, tags } : f))
        } catch (error) {
            console.error("Failed to update tags:", error)
            alert("Failed to update tags")
        }
    }, [])

    // Pass functions directly as they are stable (declared within component but rely on stable deps or we explicitly ignore deps issue if we want, but better to just let useMemo handle it by passing them as deps)
    const columns = useMemo(() => getColumns(updateStatus, updateTags), [updateStatus, updateTags])

    if (isLoading) {
        return <div>Loading features...</div>
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
            </div>
            <DataTable data={features} columns={columns} filterColumn="title" filterPlaceholder="Filter titles..." />
        </div>
    )
}
