import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const useStudentExams = () => {
    return useQuery({
        queryKey: ['student-exams'],
        queryFn: async () => {
            const { data } = await apiClient.get('/exams/student/schedule');
            return data.data; // List of exams with papers
        }
    });
};

export const useStudentResults = () => {
    return useQuery({
        queryKey: ['student-results'],
        queryFn: async () => {
            const { data } = await apiClient.get('/exams/student/results');
            return data.data; // List of exam results
        }
    });
};

export const useFacultyExams = () => {
    return useQuery({
        queryKey: ['faculty-exams'],
        queryFn: async () => {
            const { data } = await apiClient.get('/exams/faculty/exams');
            return data.data; // List of exams for grading overview
        }
    });
};

export const useFacultyExamResults = (subjectExamId) => {
    return useQuery({
        queryKey: ['faculty-exam-results', subjectExamId],
        queryFn: async () => {
            if (!subjectExamId) return [];
            const { data } = await apiClient.get(`/exams/faculty/results/${subjectExamId}`);
            return data.data; // Results for a specific paper
        },
        enabled: !!subjectExamId
    });
};

// Admin / Uploading results mutation (often done by Faculty delegated as examiners)
export const useUploadResults = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post('/exams/results/upload', payload);
            return data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['faculty-exam-results', variables.subjectExamId]);
        }
    });
};
