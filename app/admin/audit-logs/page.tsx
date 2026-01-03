"use client"

import { useEffect, useState, useMemo } from "react"
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"
import { columns } from "./columns" // Import columns definition
import { AuditLogResponseDto, AuditLogsService } from "@/lib/api"
import { Loader2, AlertCircle } from "lucide-react"
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"

export default function AuditLogsPage() {
    const [data, setData] = useState<AuditLogResponseDto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await AuditLogsService.auditLogsControllerFindAll()
                // Unwrap the response - API returns { data: [...] }
                setData(response.data || [])
            } catch (e) {
                console.error("Failed to fetch audit logs:", e)
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }
        fetchLogs()
    }, [])

    // Get unique values for filters
    const filterOptions = useMemo(() => {
        const actors = Array.from(new Set(data.map(log => log.actor).filter(Boolean))) as string[]
        const actions = Array.from(new Set(data.map(log => log.action).filter(Boolean))) as string[]
        const entityTypes = Array.from(new Set(data.map(log => log.entityType).filter(Boolean))) as string[]

        return {
            actor: actors.map(value => ({ label: value, value })),
            action: actions.map(value => ({ label: value.replace(/_/g, ' '), value })),
            entityType: entityTypes.map(value => ({ label: value, value })),
        }
    }, [data])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading audit logs...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-destructive">
                <AlertCircle className="w-8 h-8 mb-4" />
                <p>Failed to load audit logs.</p>
            </div>
        )
    }

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
                    <p className="text-muted-foreground">
                        View system activity and user actions.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <DataTableToolbar
                    table={table}
                    filterOptions={[
                        { column: "actor", title: "Actor", options: filterOptions.actor },
                        { column: "action", title: "Action", options: filterOptions.action },
                        { column: "entityType", title: "Entity", options: filterOptions.entityType },
                    ]}
                />
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DataTablePagination table={table} />
            </div>
        </div>
    )
}
