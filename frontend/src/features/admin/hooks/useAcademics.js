import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useCourses = () => {
    return useQuery({
        queryKey: ['admin', 'academic', 'courses'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/courses');
            return data.data;
        }
    });
};

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
export const useCreateSemesterSubjects = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/semesters/assign-subjects', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useCreateSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/sections', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useAllocateStudents = () => {
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/sections/allocate', data);
            return res.data;
        }
    });
};
