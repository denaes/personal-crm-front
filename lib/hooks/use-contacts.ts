"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactsService, CreateContactDto, UpdateContactDto } from "@/lib/api";

/**
 * Hook to fetch all contacts
 */
export function useContacts(options?: {
    page?: number;
    limit?: number;
    search?: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string;
    sortBy?: 'lastContactedAt' | 'updatedAt' | 'createdAt';
    sortOrder?: 'ASC' | 'DESC';
}) {
    // Determine if we are searching or listing
    const isSearch = !!options?.search;

    return useQuery({
        queryKey: ['contacts', options],
        queryFn: async () => {
            if (isSearch) {
                const response = await ContactsService.contactsControllerSearch(options!.search!);
                // Search returns data directly as ContactDto[], wrap it for consistency if needed or handle in UI
                // The backend search endpoint returns ContactDto[] directly, not nested in data/meta
                // But findAll returns { data: ContactDto[], total: number ... }
                // To keep hook compatible with UI expecting { data: ... } we might need to wrap it specifically

                // The search endpoint is also intercepted by TransformInterceptor!
                // So response is { data: ContactDto[] }
                // response.data is ContactDto[]

                const contacts = (response as any).data;

                return {
                    data: contacts, // The component expects .data to be the array of contacts when it also has total/page
                    total: contacts.length,
                    page: 1,
                    limit: contacts.length
                };
            }

            const response = await ContactsService.contactsControllerFindAll(
                options?.page,
                options?.limit,
                options?.priority,
                options?.tags,
                options?.sortBy,
                options?.sortOrder
            );
            return (response as any).data; // This is { data: ContactDto[], total: number }
        },
    });
}

/**
 * Hook to fetch a single contact by ID
 */
export function useContact(id: string) {
    return useQuery({
        queryKey: ["contact", id],
        queryFn: async () => {
            const result = await ContactsService.contactsControllerFindOne(id);
            return (result as any).data;
        },
        enabled: !!id,
    });
}

/**
 * Hook to create a new contact
 */
export function useCreateContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateContactDto) => {
            const result = await ContactsService.contactsControllerCreate(data);
            return (result as any).data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}

/**
 * Hook to update a contact
 */
export function useUpdateContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateContactDto }) => {
            const result = await ContactsService.contactsControllerUpdate(id, data);
            return (result as any).data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            queryClient.invalidateQueries({ queryKey: ["contact", variables.id] });
        },
    });
}

/**
 * Hook to delete a contact
 */
export function useDeleteContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ContactsService.contactsControllerDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}

/**
 * Hook to sync Google Contacts
 */
export function useSyncContacts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => ContactsService.contactsControllerSync(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}
