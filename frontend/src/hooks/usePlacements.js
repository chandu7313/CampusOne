import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const usePlacementOpportunities = () => {
    return useQuery({
        queryKey: ['placement-opportunities'],
        queryFn: async () => {
            const { data } = await apiClient.get('/placements/opportunities');
            return data.data;
        }
    });
};

export const useStudentApplications = () => {
    return useQuery({
        queryKey: ['student-applications'],
        queryFn: async () => {
            const { data } = await apiClient.get('/placements/my-applications');
            return data.data;
        }
    });
};

export const useApplyForOpportunity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post('/placements/apply', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['student-applications']);
        }
    });
};

export const useCreatePlacementOpportunity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post('/placements/opportunities', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['placement-opportunities']);
        }
    });
};

export const useOpportunityApplications = (opportunityId) => {
    return useQuery({
        queryKey: ['opportunity-applications', opportunityId],
        queryFn: async () => {
            if (!opportunityId) return [];
            const { data } = await apiClient.get(`/placements/opportunities/${opportunityId}/applications`);
            return data.data;
        },
        enabled: !!opportunityId
    });
};

export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status, notes }) => {
            const { data } = await apiClient.patch(`/placements/applications/${id}/status`, { status, notes });
            return data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['opportunity-applications']);
        }
    });
};
