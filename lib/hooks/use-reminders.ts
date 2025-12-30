"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RemindersService, CreateReminderDto, UpdateReminderDto } from "@/lib/api";

/**
 * Hook to fetch all reminders
 */
export function useReminders(active?: boolean) {
    return useQuery({
        queryKey: ["reminders", active],
        queryFn: async () => {
            const result = await RemindersService.remindersControllerFindAll(active);
            // @ts-ignore
            return result.data || result;
        },
    });
}

/**
 * Hook to fetch due reminders
 */
export function useDueReminders() {
    return useQuery({
        queryKey: ["reminders", "due"],
        queryFn: async () => {
            const result = await RemindersService.remindersControllerFindDue();
            // @ts-ignore
            return result.data || result;
        },
    });
}

/**
 * Hook to fetch reminders for a specific contact
 */
export function useRemindersByContact(contactId: string) {
    return useQuery({
        queryKey: ["reminders", "contact", contactId],
        queryFn: async () => {
            const result = await RemindersService.remindersControllerFindByContact(contactId);
            // @ts-ignore
            return result.data || result;
        },
        enabled: !!contactId,
    });
}

/**
 * Hook to fetch a single reminder by ID
 */
export function useReminder(id: string) {
    return useQuery({
        queryKey: ["reminder", id],
        queryFn: async () => {
            const result = await RemindersService.remindersControllerFindOne(id);
            // @ts-ignore
            return result.data || result;
        },
        enabled: !!id,
    });
}

/**
 * Hook to create a new reminder
 */
export function useCreateReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateReminderDto) => {
            const result = await RemindersService.remindersControllerCreate(data);
            // @ts-ignore
            return result.data || result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },
    });
}

/**
 * Hook to update a reminder
 */
export function useUpdateReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateReminderDto }) => {
            const result = await RemindersService.remindersControllerUpdate(id, data);
            // @ts-ignore
            return result.data || result;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
            queryClient.invalidateQueries({ queryKey: ["reminder", variables.id] });
        },
    });
}

/**
 * Hook to delete a reminder
 */
export function useDeleteReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => RemindersService.remindersControllerRemove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },
    });
}

/**
 * Hook to snooze a reminder
 */
export function useSnoozeReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, hours }: { id: string; hours?: number }) => {
            const result = await RemindersService.remindersControllerSnooze(id, hours);
            // @ts-ignore
            return result.data || result;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
            queryClient.invalidateQueries({ queryKey: ["reminder", variables.id] });
        },
    });
}
