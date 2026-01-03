import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FeatureRequestsService, CreateFeatureRequestDto, UpdateFeatureRequestDto } from "../api";

export interface FeatureRequest extends CreateFeatureRequestDto {
    id: string;
    status: string;
    upvotes: number;
    hasUserVoted: boolean;
    creator: {
        id: string;
        email: string;
        displayName: string;
    };
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export function useFeatureRequests(
    status?: string,
    tags?: string,
    sortBy: 'votes' | 'newest' | 'updated' = 'votes',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
) {
    return useQuery<FeatureRequest[]>({
        queryKey: ["feature-requests", status, tags, sortBy, sortOrder],
        queryFn: async () => {
            const response = await FeatureRequestsService.featureRequestsControllerFindAll(
                status,
                tags,
                sortBy,
                sortOrder
            );
            return (response as unknown as { data: FeatureRequest[] }).data;
        },
    });
}

export function useFeatureRequest(id: string) {
    return useQuery<FeatureRequest>({
        queryKey: ["feature-request", id],
        queryFn: async () => {
            const response = await FeatureRequestsService.featureRequestsControllerFindOne(id);
            return (response as unknown as { data: FeatureRequest }).data;
        },
        enabled: !!id,
    });
}

export function useCreateFeatureRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateFeatureRequestDto) => {
            const response = await FeatureRequestsService.featureRequestsControllerCreate(data);
            return (response as unknown as { data: FeatureRequest }).data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
        },
    });
}

export function useUpdateFeatureRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateFeatureRequestDto }) => {
            const response = await FeatureRequestsService.featureRequestsControllerUpdate(id, data);
            return (response as unknown as { data: FeatureRequest }).data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
            queryClient.invalidateQueries({ queryKey: ["feature-request", variables.id] });
        },
    });
}

export function useDeleteFeatureRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => FeatureRequestsService.featureRequestsControllerDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
        },
    });
}

export function useVoteFeatureRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (featureId: string) => {
            const response = await FeatureRequestsService.featureRequestsControllerVote(featureId);
            return (response as unknown as { data: FeatureRequest }).data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
        },
    });
}

export function useUnvoteFeatureRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (featureId: string) => {
            const response = await FeatureRequestsService.featureRequestsControllerUnvote(featureId);
            return (response as unknown as { data: FeatureRequest }).data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
        },
    });
}
