import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const useMyAttendance = () => {
    return useQuery({
        queryKey: ['my-attendance'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/attendance/me');
            return data.data; // Array of attendance stats by subject
        }
    });
};

export const useClassAttendance = (subjectId, date) => {
    return useQuery({
        queryKey: ['class-attendance', subjectId, date],
        queryFn: async () => {
            if (!subjectId || !date) return [];
            const { data } = await apiClient.get('/academic/attendance/class', {
                params: { subjectId, date }
            });
            return data.data; // Array of specific day records
        },
        enabled: !!subjectId && !!date
    });
};
