"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactsService, CreateContactDto, UpdateContactDto, ContactDto } from "@/lib/api";

export type Contact = ContactDto;

interface ContactsResponse {
    data: Contact[];
    total: number;
    page: number;
    limit: number;
}

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

    return useQuery<ContactsResponse>({
        queryKey: ['contacts', options],
        queryFn: async () => {
            if (isSearch) {
                const response = await ContactsService.contactsControllerSearch(options!.search!);
                // Search returns WrappedContactListResponseDto
                // response.data is ContactDto[]
                const contacts = response.data || [];

                return {
                    data: contacts,
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

            // response is ContactsListResponseDto
            // response.data is PaginatedContactResultDto
            const paginatedResult = response.data;

            return {
                data: paginatedResult.data || [],
                total: paginatedResult.total,
                page: paginatedResult.page,
                limit: paginatedResult.limit
            };
        },
    });
}

/**
 * Hook to fetch a single contact by ID
 */
export function useContact(id: string) {
    return useQuery<Contact>({
        queryKey: ["contact", id],
        queryFn: async () => {
            const result = await ContactsService.contactsControllerFindOne(id);
            // result is ContactResponseDto, result.data is ContactDto
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
            // result is ContactResponseDto
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
            // result is ContactResponseDto
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
