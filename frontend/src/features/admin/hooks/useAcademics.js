import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export const useCourses = () => {
    return useQuery({
        queryKey: ['admin', 'academic', 'courses'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/courses');
            return data.data;
        }
    });
};

export const useAcademicHierarchy = () => {
    return useQuery({
        queryKey: ['admin', 'academic', 'hierarchy', 'v2'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/hierarchy');
            return data.data;
        }
    });
};

export const useSections = (semesterId) => {
    return useQuery({
        queryKey: ['admin', 'academic', 'sections', semesterId],
        queryFn: async () => {
            const endpoint = semesterId ? `/academic/sections?semesterId=${semesterId}` : '/academic/sections';
            const { data } = await apiClient.get(endpoint);
            return data.data;
        },
        enabled: !!semesterId
    });
};

export const useCreateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/departments', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useCreateProgram = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/programs', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/courses', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};
export const useCreateSemesterSubjects = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/semesters/assign-subjects', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useCreateSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/sections', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useAllocateStudents = () => {
    return useMutation({
        mutationFn: async (data) => {
            const { data: res } = await apiClient.post('/academic/sections/allocate', data);
            return res.data;
        }
    });
};

export const useInitializeProgram = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ programId, ...body }) => {
            const { data: res } = await apiClient.post(`/academic/programs/${programId}/initialize`, body);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useUpdateSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }) => {
            const { data: res } = await apiClient.put(`/academic/sections/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useDeleteSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await apiClient.delete(`/academic/sections/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useDeleteDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await apiClient.delete(`/academic/departments/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useDeleteProgram = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // pass { id, force: true } to trigger cascade delete
        mutationFn: async ({ id, force = false }) => {
            const url = force
                ? `/academic/programs/${id}?force=true`
                : `/academic/programs/${id}`;
            try {
                const { data: res } = await apiClient.delete(url);
                return res; // { status, message }
            } catch (err) {
                // Axios throws on 4xx — re-throw the response data so callers
                // can inspect canForceDelete
                throw err.response?.data ?? err;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useDeleteYear = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data: res } = await apiClient.delete(`/academic/years/${id}`);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};

export const useDeleteSemester = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data: res } = await apiClient.delete(`/academic/semesters/${id}`);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'academic', 'hierarchy']);
        }
    });
};
