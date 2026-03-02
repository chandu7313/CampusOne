import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';
import { Settings, Bell, Shield, Calendar, Save, RotateCcw } from 'lucide-react';

const SystemSettings = () => {
    const queryClient = useQueryClient();
    const { data: configs, isLoading } = useQuery({
        queryKey: ['admin', 'config'],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/config');
            return data.data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ key, value }) => {
            await apiClient.put(`/admin/config/${key}`, { value });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'config']);
        }
    });

    const [localState, setLocalState] = useState({});

    const handleChange = (key, value) => {
        setLocalState(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = (key) => {
        updateMutation.mutate({ key, value: localState[key] });
    };

    if (isLoading) return <div className="text-center p-16 text-white/40">Loading Settings...</div>;

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold m-0 text-white">System Configuration</h2>
                <p className="text-[0.9rem] text-white/40 m-0">Manage global institutional parameters and security policies.</p>
            </header>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
                <div className="glass bg-white/3 backdrop-blur-md border border-white/5 rounded-[20px] p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-blue-500" />
                        <h3 className="m-0 text-[1.1rem] font-semibold text-white">Academic Year</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[0.85rem] text-white/50">Current Academic Year</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                defaultValue={configs?.find(c => c.key === 'academic_year')?.value || '2025-2026'}
                                onChange={(e) => handleChange('academic_year', e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-[10px_12px] text-white outline-none focus:border-primary transition-colors"
                            />
                            <button onClick={() => handleSave('academic_year')} className="bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg px-3 cursor-pointer transition-all duration-200 hover:bg-blue-500 hover:text-white">
                                <Save size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="glass bg-white/3 backdrop-blur-md border border-white/5 rounded-[20px] p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Shield size={20} className="text-blue-500" />
                        <h3 className="m-0 text-[1.1rem] font-semibold text-white">Security Policies</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[0.85rem] text-white/50">Login Attempt Threshold</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                defaultValue={configs?.find(c => c.key === 'login_attempts')?.value || 5}
                                onChange={(e) => handleChange('login_attempts', parseInt(e.target.value))}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-[10px_12px] text-white outline-none focus:border-primary transition-colors"
                            />
                            <button onClick={() => handleSave('login_attempts')} className="bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg px-3 cursor-pointer transition-all duration-200 hover:bg-blue-500 hover:text-white">
                                <Save size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="glass bg-white/3 backdrop-blur-md border border-white/5 rounded-[20px] p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Bell size={20} className="text-blue-500" />
                        <h3 className="m-0 text-[1.1rem] font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="flex justify-between items-center text-[0.9rem] text-white/80">
                        <span>Enable Email Alerts</span>
                        <label className="relative inline-block w-11 h-6 cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
