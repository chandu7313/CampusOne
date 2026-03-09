import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const useStudentAssignments = () => {
    return useQuery({
        queryKey: ['student-assignments'],
        queryFn: async () => {
            const { data } = await apiClient.get('/assignments/student');
            return data.data;
        }
    });
};

export const useSubmitAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post('/assignments/submit', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['student-assignments']);
        }
    });
};

export const useFacultyAssignments = (subjectId) => {
    return useQuery({
        queryKey: ['faculty-assignments', subjectId],
        queryFn: async () => {
            const params = subjectId ? { subjectId } : {};
            const { data } = await apiClient.get('/assignments/faculty', { params });
            return data.data;
        }
    });
};

export const useCreateAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post('/assignments', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['faculty-assignments']);
        }
    });
};

export const useAssignmentSubmissions = (assignmentId) => {
    return useQuery({
        queryKey: ['assignment-submissions', assignmentId],
        queryFn: async () => {
            if (!assignmentId) return [];
            const { data } = await apiClient.get(`/assignments/${assignmentId}/submissions`);
            return data.data;
        },
        enabled: !!assignmentId
    });
};

export const useGradeSubmission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ submissionId, payload }) => {
            const { data } = await apiClient.post(`/assignments/submissions/${submissionId}/grade`, payload);
            return data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['assignment-submissions']);
        }
    });
};
