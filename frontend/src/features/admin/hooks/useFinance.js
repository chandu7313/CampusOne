import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useFinanceOverview = () => {
    return useQuery({
        queryKey: ['admin', 'finance', 'overview'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance-admin/overview');
            return data.data;
        }
    });
};

export const useCreateFeeStructure = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/finance-admin/fee-structures', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'finance', 'overview']);
        }
    });
};

export const useApproveScholarship = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (scholarshipId) => {
            const { data: res } = await apiClient.patch(`/finance-admin/scholarships/${scholarshipId}/approve`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'finance', 'overview']);
            queryClient.invalidateQueries(['admin', 'stats']);
        }
    });
};
