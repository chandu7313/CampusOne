import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useAdminStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/stats');
            return data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useActivityLogs = (params = {}) => {
    return useQuery({
        queryKey: ['admin', 'logs', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/logs', { params });
            return data.data;
        },
        keepPreviousData: true
    });
};
