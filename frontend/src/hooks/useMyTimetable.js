import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const useMyTimetable = () => {
    return useQuery({
        queryKey: ['my-timetable'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/timetable/me');
            return data.data.entries; // Updated to use .entries
        }
    });
};
