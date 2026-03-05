import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useTimetables = (sectionId) => {
    return useQuery({
        queryKey: ['admin', 'timetable', sectionId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/academic/timetable/section/${sectionId}`);
            return data.data;
        },
        enabled: !!sectionId
    });
};

export const useClassrooms = () => {
    return useQuery({
        queryKey: ['admin', 'classrooms'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/classrooms');
            return data.data;
        }
    });
};

export const useTimeSlots = () => {
    return useQuery({
        queryKey: ['admin', 'timeslots'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/time-slots');
            return data.data;
        }
    });
};

export const useCreateTimetableEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/timetable', data);
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['admin', 'timetable', variables.sectionId]);
        }
    });
};
