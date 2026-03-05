import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useFacultyProfiles = (deptId) => {
    return useQuery({
        queryKey: ['admin', 'faculty', deptId],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/faculty', {
                params: { departmentId: deptId }
            });
            return data.data;
        }
    });
};

export const useFacultyWorkload = (facultyId) => {
    return useQuery({
        queryKey: ['admin', 'faculty', 'workload', facultyId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/academic/faculty/${facultyId}/workload`);
            return data.data;
        },
        enabled: !!facultyId
    });
};

export const useCreateFacultyAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/faculty/assignments', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'faculty']);
        }
    });
};
