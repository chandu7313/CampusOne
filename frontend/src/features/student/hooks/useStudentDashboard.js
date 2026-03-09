import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useStudentDashboard = () => {
    return useQuery({
        queryKey: ['student', 'dashboard', 'summary'],
        queryFn: async () => {
            const { data } = await apiClient.get('/dashboard/summary');
            return data.data;
        }
    });
};

export const useStudentCourses = () => {
    return useQuery({
        queryKey: ['student', 'courses'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/courses/student');
            return data.data;
        }
    });
};

export const useStudentAssignments = () => {
    return useQuery({
        queryKey: ['student', 'assignments'],
        queryFn: async () => {
            const { data } = await apiClient.get('/assignments/student');
            return data.data;
        }
    });
};

export const useStudentMessages = () => {
    return useQuery({
        queryKey: ['student', 'messages'],
        queryFn: async () => {
            const { data } = await apiClient.get('/communication/messages');
            return data.data;
        }
    });
};

export const useRecentPlacements = () => {
    return useQuery({
        queryKey: ['student', 'placements'],
        queryFn: async () => {
            const { data } = await apiClient.get('/placements/recent');
            return data.data;
        }
    });
};
