import { useMutation } from '@tanstack/react-query';
import { AiCommandService } from '@/lib/api';

export interface CommandRequest {
    message: string;
    conversationId?: string;
    mentionedContactIds?: string[];
}

export interface CommandResponse {
    success: boolean;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    toolsUsed?: string[];
    conversationId?: string;
    error?: {
        code: string;
        details?: string;
    };
}

async function sendAiCommand(request: CommandRequest): Promise<CommandResponse> {
    const result = await AiCommandService.aiCommandControllerProcessCommand(request);
    return result.data || result;
}

export function useAiCommand() {
    return useMutation({
        mutationFn: sendAiCommand,
    });
}
