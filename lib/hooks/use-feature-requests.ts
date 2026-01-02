import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FeatureRequestsService, CreateFeatureRequestDto, UpdateFeatureRequestDto } from "../api";

export function useFeatureRequests(
    status?: string,
    tags?: string,
    sortBy: string = 'votes',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
) {
    return useQuery({
        queryKey: ["feature-requests", status, tags, sortBy, sortOrder],
        queryFn: async () => {
            const response = await FeatureRequestsService.featureRequestsControllerFindAll(
                status,
                tags,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sortBy as any,
                sortOrder
            );
            return response.data;
        },
    });
}

export function useFeatureRequest(id: string) {
    return useQuery({
        queryKey: ["feature-request", id],
        queryFn: async () => {
            const response = await FeatureRequestsService.featureRequestsControllerFindOne(id);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCreateFeatureRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateFeatureRequestDto) => {
            const response = await FeatureRequestsService.featureRequestsControllerCreate(data);
            return response.data;
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
            return response.data;
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
            return response.data;
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
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
        },
    });
}
