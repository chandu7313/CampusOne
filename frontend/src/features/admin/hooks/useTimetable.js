import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

// Core Timetables Hooks (Aligned to /api/v1/timetables)

export const useTimetables = (filters = {}) => {
    return useQuery({
        queryKey: ['admin', 'timetables', filters],
        queryFn: async () => {
            const { data } = await apiClient.get('/timetables', { params: filters });
            return data.data;
        }
    });
};

export const useAvailableSections = (semesterId, academicYear) => {
    return useQuery({
        queryKey: ['admin', 'sections', 'available', semesterId, academicYear],
        queryFn: async () => {
            const { data } = await apiClient.get('/timetables/available-sections', {
                params: { semesterId, academicYear }
            });
            return data.data;
        },
        enabled: !!semesterId && !!academicYear
    });
};

export const useTimetableById = (id) => {
    return useQuery({
        queryKey: ['admin', 'timetable', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/timetables/${id}`);
            return data.data;
        },
        enabled: !!id
    });
};

export const useSectionTimetable = (sectionId) => {
    return useQuery({
        queryKey: ['admin', 'timetable', 'section', sectionId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/timetables/section/${sectionId}`);
            return data.data;
        },
        enabled: !!sectionId
    });
};

export const useCreateTimetable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post('/timetables/create', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'timetables']);
        }
    });
};

export const useUpdateTimetable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }) => {
            const { data } = await apiClient.put(`/timetables/update/${id}`, payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'timetables']);
        }
    });
};

export const useDeleteTimetable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await apiClient.delete(`/timetables/delete/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'timetables']);
        }
    });
};

export const useTimetableConflicts = (params) => {
    return useQuery({
        queryKey: ['admin', 'timetables', 'conflicts', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/timetables/conflicts', { params });
            return data.data;
        },
        enabled: !!(params.timeSlotId && params.dayOfWeek && (params.facultyId || params.classroomId))
    });
};

// Maintenance Hooks

export const useClassrooms = () => {
    return useQuery({
        queryKey: ['admin', 'classrooms'],
        queryFn: async () => {
            const { data } = await apiClient.get('/timetables/classrooms');
            return data.data;
        }
    });
};

export const useTimeSlots = () => {
    return useQuery({
        queryKey: ['admin', 'timeslots'],
        queryFn: async () => {
            const { data } = await apiClient.get('/timetables/time-slots');
            return data.data;
        }
    });
};

export const useAddSlot = (timetableId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post(`/timetables/${timetableId}/slots`, payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'timetable', timetableId]);
        }
    });
};

export const useUpdateSlot = (timetableId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ slotId, payload }) => {
            const { data } = await apiClient.put(`/timetables/${timetableId}/slots/${slotId}`, payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'timetable', timetableId]);
        }
    });
};

export const useDeleteSlot = (timetableId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (slotId) => {
            await apiClient.delete(`/timetables/${timetableId}/slots/${slotId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'timetable', timetableId]);
        }
    });
};

export const useFacultySlots = (facultyId, academicYear) => {
    return useQuery({
        queryKey: ['admin', 'faculty-slots', facultyId, academicYear],
        queryFn: async () => {
            const { data } = await apiClient.get(`/timetables/faculty/${facultyId}`, {
                params: { academicYear }
            });
            return data.data;
        },
        enabled: !!facultyId
    });
};

