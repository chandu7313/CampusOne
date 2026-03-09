import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const useAuthorities = () => {
    return useQuery({
        queryKey: ['authorities'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/authorities');
            return data.data;
        }
    });
};

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data } = await apiClient.get('/users/me');
            return data.data;
        }
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.patch('/users/update-me', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['profile']);
        }
    });
};
