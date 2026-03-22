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

export const useClassAttendance = (subjectId, sectionId, date) => {
    return useQuery({
        queryKey: ['class-attendance', subjectId, sectionId, date],
        queryFn: async () => {
            if (!subjectId || !sectionId || !date) return [];
            const { data } = await apiClient.get('/academic/attendance/class', {
                params: { subjectId, sectionId, date }
            });
            return data.data; // Array of specific day records
        },
        enabled: !!subjectId && !!sectionId && !!date
    });
};

export const useSections = (semesterId) => {
    return useQuery({
        queryKey: ['sections', semesterId],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/sections', {
                params: { semesterId }
            });
            return data.data;
        }
    });
};

export const useSectionStudents = (sectionId) => {
    return useQuery({
        queryKey: ['section-students', sectionId],
        queryFn: async () => {
            if (!sectionId) return [];
            const { data } = await apiClient.get(`/academic/sections/${sectionId}/students`);
            return data.data;
        },
        enabled: !!sectionId
    });
};
