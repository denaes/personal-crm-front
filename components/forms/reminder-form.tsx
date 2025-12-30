"use client";

import { useForm } from "react-hook-form";
import { CreateReminderDto, UpdateReminderDto } from "@/lib/api";
import { useCreateReminder, useUpdateReminder } from "@/lib/hooks/use-reminders";
import { useContacts } from "@/lib/hooks/use-contacts";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Reminder Types from DTO
const REMINDER_TYPES = [
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'custom', label: 'Custom' },
];

interface ReminderFormProps {
    initialData?: UpdateReminderDto & { id: string, contactId?: string, scheduledFor?: string, type?: string, message?: string };
    contactId?: string;
    onSuccess?: () => void;
}

export function ReminderForm({ initialData, contactId, onSuccess }: ReminderFormProps) {
    const router = useRouter();
    const isEditing = !!initialData?.id;

    const { mutate: createReminder, isPending: isCreating } = useCreateReminder();
    const { mutate: updateReminder, isPending: isUpdating } = useUpdateReminder();

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            contactId: initialData?.contactId || contactId || "",
            type: initialData?.type || "follow_up",
            message: initialData?.message || "",
            scheduledFor: initialData?.scheduledFor
                ? new Date(initialData.scheduledFor).toISOString().slice(0, 16)
                : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default tomorrow
        }
    });

    const { data: contactsData } = useContacts({ limit: 100 });
    const contacts = contactsData?.data || [];

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            scheduledFor: new Date(data.scheduledFor).toISOString(),
            isActive: true, // Default active on create/update
        };

        if (isEditing && initialData?.id) {
            updateReminder({ id: initialData.id, data: payload }, {
                onSuccess: () => {
                    if (onSuccess) onSuccess();
                    else router.back();
                }
            });
        } else {
            createReminder(payload, {
                onSuccess: () => {
                    if (onSuccess) onSuccess();
                    else router.back();
                }
            });
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                    Contact
                </label>
                <select
                    {...register("contactId", { required: "Contact is required" })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!!contactId || isEditing}
                >
                    <option value="">Select a contact...</option>
                    {contacts.map((contact: any) => (
                        <option key={contact.id} value={contact.id}>
                            {contact.displayName || `${contact.givenName} ${contact.familyName}`}
                        </option>
                    ))}
                </select>
                {errors.contactId && <p className="text-sm text-destructive">{errors.contactId.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Type
                    </label>
                    <select
                        {...register("type", { required: true })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        {REMINDER_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Due Date
                    </label>
                    <input
                        type="datetime-local"
                        {...register("scheduledFor", { required: true })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                    Message
                </label>
                <input
                    type="text"
                    {...register("message", { required: "Message is required" })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder="Call expecting proposal..."
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message.message as string}</p>}
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : isEditing ? "Update Reminder" : "Set Reminder"}
                </Button>
            </div>
        </form>
    );
}
