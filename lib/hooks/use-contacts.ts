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
                console.log('[useContacts] Searching for:', options!.search!);
                const response = await ContactsService.contactsControllerSearch(options!.search!);
                console.log('[useContacts] Search response:', response);
                console.log('[useContacts] Search response.data:', response.data);
                // Search returns data directly as ContactDto[]
                // Wrap it in the same structure as findAll for consistency
                const result = {
                    data: response.data,
                    total: response.data.length,
                    page: 1,
                    limit: response.data.length
                };
                console.log('[useContacts] Returning wrapped result:', result);
                return result;
            }

            const response = await ContactsService.contactsControllerFindAll(
                options?.page,
                options?.limit,
                options?.priority,
                options?.tags,
                options?.sortBy,
                options?.sortOrder
            );
            return response.data;
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
            return result.data;
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
            return result.data;
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
            return result.data;
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
