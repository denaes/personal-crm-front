"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InteractionsService, CreateInteractionDto, UpdateInteractionDto } from "@/lib/api";

/**
 * Hook to fetch all interactions
 */
export function useInteractions() {
    return useQuery({
        queryKey: ["interactions"],
        queryFn: async () => {
            const result = await InteractionsService.interactionsControllerFindAll();
            // @ts-ignore
            return result.data || result;
        },
    });
}

/**
 * Hook to fetch interactions for a specific contact
 */
export function useInteractionsByContact(contactId: string) {
    return useQuery({
        queryKey: ["interactions", "contact", contactId],
        queryFn: async () => {
            const result = await InteractionsService.interactionsControllerFindByContact(contactId);
            // @ts-ignore
            return result.data || result;
        },
        enabled: !!contactId,
    });
}

/**
 * Hook to fetch a single interaction by ID
 */
export function useInteraction(id: string) {
    return useQuery({
        queryKey: ["interaction", id],
        queryFn: async () => {
            const result = await InteractionsService.interactionsControllerFindOne(id);
            // @ts-ignore
            return result.data || result;
        },
        enabled: !!id,
    });
}

/**
 * Hook to create a new interaction
 */
export function useCreateInteraction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateInteractionDto) => {
            const result = await InteractionsService.interactionsControllerCreate(data);
            // @ts-ignore
            return result.data || result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interactions"] });
        },
    });
}

/**
 * Hook to update an interaction
 */
export function useUpdateInteraction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateInteractionDto }) => {
            const result = await InteractionsService.interactionsControllerUpdate(id, data);
            // @ts-ignore
            return result.data || result;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["interactions"] });
            queryClient.invalidateQueries({ queryKey: ["interaction", variables.id] });
        },
    });
}

/**
 * Hook to delete an interaction
 */
export function useDeleteInteraction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => InteractionsService.interactionsControllerRemove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interactions"] });
        },
    });
}
