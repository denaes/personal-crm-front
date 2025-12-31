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
    // @ts-ignore
    return result.data || result;
}

export function useAiCommand() {
    return useMutation({
        mutationFn: sendAiCommand,
    });
}
