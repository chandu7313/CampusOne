import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useAcademicHierarchy = () => {
    return useQuery({
        queryKey: ['admin', 'academic', 'hierarchy'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/hierarchy');
            return data.data;
        }
    });
};

export const useCreateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/departments', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useCreateProgram = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/programs', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/courses', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};
