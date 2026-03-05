import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useExams = () => {
    return useQuery({
        queryKey: ['admin', 'exams'],
        queryFn: async () => {
            const { data } = await apiClient.get('/exams');
            return data.data;
        }
    });
};

export const useCreateExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (examData) => {
            const { data } = await apiClient.post('/exams', examData);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'exams']);
        }
    });
};

export const useExamSchedule = (examId) => {
    return useQuery({
        queryKey: ['admin', 'exams', 'schedule', examId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/exams/${examId}/schedule`);
            return data.data;
        },
        enabled: !!examId
    });
};

export const useUploadResults = () => {
    return useMutation({
        mutationFn: async ({ subjectExamId, results }) => {
            const { data } = await apiClient.post('/exams/results/upload', {
                subjectExamId,
                results
            });
            return data.data;
        }
    });
};

export const useScheduleSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (scheduleData) => {
            const { data } = await apiClient.post('/exams/schedule', scheduleData);
            return data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['admin', 'exams', 'schedule', variables.examId]);
        }
    });
};
