import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useUsers = (params = {}) => {
    return useQuery({
        queryKey: ['admin', 'users', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/users', { params });
            return data.data;
        },
        keepPreviousData: true
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userData) => {
            const { data } = await apiClient.post('/admin/users', userData);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'users']);
        }
    });
};

export const useToggleUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId) => {
            const { data } = await apiClient.patch(`/admin/users/${userId}/status`);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'users']);
            queryClient.invalidateQueries(['admin', 'stats']);
        }
    });
};
