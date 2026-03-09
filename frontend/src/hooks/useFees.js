import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const useStudentFees = () => {
    return useQuery({
        queryKey: ['student-fees'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/student/me');
            return data.data; // List of fee records
        }
    });
};

export const usePayFee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post('/finance/student/pay', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['student-fees']);
        }
    });
};
