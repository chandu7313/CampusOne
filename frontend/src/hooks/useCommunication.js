import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const useMessages = () => {
    return useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const { data } = await apiClient.get('/communication/messages');
            return data.data;
        }
    });
};

export const useMarkMessageRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (messageId) => {
            await apiClient.patch(`/communication/messages/${messageId}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['messages']);
        }
    });
};

export const useAnnouncements = () => {
    return useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const { data } = await apiClient.get('/communication/announcements');
            return data.data;
        }
    });
};

export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const { data } = await apiClient.get('/communication/events');
            return data.data;
        }
    });
};
