import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useAdmitStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/students/admit', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'stats']);
        }
    });
};

export const usePromoteStudents = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (studentIds) => {
            const { data: res } = await apiClient.post('/students/promote', { studentIds });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'users']);
            queryClient.invalidateQueries(['admin', 'stats']);
        }
    });
};

export const useEnrollInCourse = () => {
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/students/enroll', data);
            return res.data;
        }
    });
};
