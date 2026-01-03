"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RemindersService, CreateReminderDto, UpdateReminderDto, ReminderResponseDto } from "@/lib/api";

/**
 * Hook to fetch all reminders
 */
export function useReminders(active?: boolean) {
    return useQuery<ReminderResponseDto[]>({
        queryKey: ["reminders", active],
        queryFn: async () => {
            const result = await RemindersService.remindersControllerFindAll(active);
            return (result as unknown as { data: ReminderResponseDto[] }).data;
        },
    });
}

/**
 * Hook to fetch due reminders
 */
export function useDueReminders() {
    return useQuery<ReminderResponseDto[]>({
        queryKey: ["reminders", "due"],
        queryFn: async () => {
            const result = await RemindersService.remindersControllerFindDue();
            return (result as unknown as { data: ReminderResponseDto[] }).data;
        },
    });
}

/**
 * Hook to fetch reminders for a specific contact
 */
export function useRemindersByContact(contactId: string) {
    return useQuery<ReminderResponseDto[]>({
        queryKey: ["reminders", "contact", contactId],
        queryFn: async () => {
            const result = await RemindersService.remindersControllerFindByContact(contactId);
            return (result as unknown as { data: ReminderResponseDto[] }).data;
        },
        enabled: !!contactId,
    });
}

/**
 * Hook to fetch a single reminder by ID
 */
export function useReminder(id: string) {
    return useQuery<ReminderResponseDto>({
        queryKey: ["reminder", id],
        queryFn: async () => {
            const result = await RemindersService.remindersControllerFindOne(id);
            return (result as unknown as { data: ReminderResponseDto }).data;
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
            return (result as unknown as { data: ReminderResponseDto }).data;
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
            return (result as unknown as { data: ReminderResponseDto }).data;
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
            return (result as unknown as { data: ReminderResponseDto }).data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
            queryClient.invalidateQueries({ queryKey: ["reminder", variables.id] });
        },
    });
}
