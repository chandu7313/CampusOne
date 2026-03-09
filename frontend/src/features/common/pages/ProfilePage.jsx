import React, { useState } from 'react';
import { useProfile, useUpdateProfile } from '../../../hooks/useUser';
import { User, Mail, Phone, MapPin, Edit3, Save, Camera, Shield, GraduationCap, Building } from 'lucide-react';

const ProfilePage = () => {
    const { data: profileData, isLoading } = useProfile();
    const updateMutation = useUpdateProfile();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    if (isLoading) return <div className="p-20 text-center animate-pulse text-primary font-bold">Loading Profile...</div>;

    const user = profileData?.user;
    const profile = profileData?.profile;

    const handleUpdate = () => {
        updateMutation.mutate(formData, {
            onSuccess: () => setIsEditing(false)
        });
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-20 animate-in fade-in duration-700">
            {/* Profile Header Card */}
            <div className="glass-card rounded-[40px] overflow-hidden border border-border-custom/50 mb-10 shadow-2xl shadow-black/10">
                <div className="h-48 bg-gradient-to-r from-primary to-primary-hover relative">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                </div>
                
                <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-20 relative">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-white dark:bg-black p-2 border border-border-custom overflow-hidden shadow-2xl">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-[1.8rem]" />
                            ) : (
                                <div className="w-full h-full bg-primary/5 rounded-[1.8rem] flex items-center justify-center text-primary font-black text-4xl">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                            )}
                        </div>
                        <button className="absolute bottom-2 right-2 p-3 bg-white dark:bg-black border border-border-custom rounded-2xl shadow-lg hover:scale-110 transition-transform text-primary">
                            <Camera size={20} />
                        </button>
                    </div>
                    
                    <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-black text-text-main tracking-tighter uppercase italic">
                                    {user?.firstName} <span className="text-primary">{user?.lastName}</span>
                                </h1>
                                <p className="text-lg font-bold text-text-muted flex items-center gap-2 mt-1">
                                    <Shield size={18} className="text-primary" /> {user?.role}
                                </p>
                            </div>
                            <button 
                                onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg
                                ${isEditing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-primary text-white hover:bg-primary-hover'}`}
                            >
                                {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit3 size={18} /> Edit Profile</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Contact Information */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="glass-card p-10 rounded-[30px] border border-border-custom/50 shadow-xl">
                        <h2 className="text-2xl font-black text-text-main mb-8 uppercase tracking-widest italic flex items-center gap-3">
                            <span className="p-2 bg-primary/10 text-primary rounded-xl"><User size={20} /></span>
                            Personal Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoField 
                                label="First Name" 
                                value={user?.firstName} 
                                icon={<User size={16} />} 
                                isEditing={isEditing} 
                                onChange={v => setFormData({...formData, firstName: v})}
                            />
                            <InfoField 
                                label="Last Name" 
                                value={user?.lastName} 
                                icon={<User size={16} />} 
                                isEditing={isEditing}
                                onChange={v => setFormData({...formData, lastName: v})}
                            />
                            <InfoField 
                                label="Official Email" 
                                value={user?.email} 
                                icon={<Mail size={16} />} 
                                isEditing={isEditing}
                                onChange={v => setFormData({...formData, email: v})}
                            />
                            <InfoField 
                                label="Phone Number" 
                                value={profile?.phoneNumber || 'Not Set'} 
                                icon={<Phone size={16} />} 
                                isEditing={isEditing}
                                onChange={v => setFormData({...formData, phone: v})}
                            />
                        </div>
                    </section>

                    {/* Bio / About */}
                    <section className="glass-card p-10 rounded-[30px] border border-border-custom/50 shadow-xl">
                        <h2 className="text-2xl font-black text-text-main mb-6 uppercase tracking-widest italic">Bio & Expertise</h2>
                        {isEditing ? (
                            <textarea 
                                className="w-full bg-black/5 dark:bg-white/5 border border-border-custom/50 rounded-2xl p-4 text-text-main font-medium min-h-[150px] outline-none focus:border-primary transition-all"
                                defaultValue={profile?.bio}
                                onChange={e => setFormData({...formData, bio: e.target.value})}
                            />
                        ) : (
                            <p className="text-text-muted font-medium leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                                {profile?.bio || "No biography provided yet. Add some flavor to your profile!"}
                            </p>
                        )}
                    </section>
                </div>

                {/* Academic/Professional Metadata */}
                <div className="space-y-10">
                    <section className="glass-card p-10 rounded-[30px] border border-border-custom/50 shadow-xl">
                        <h2 className="text-xl font-black text-text-main mb-8 uppercase tracking-widest italic">Credentials</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner"><Building size={20} /></div>
                                <div>
                                    <p className="text-[0.65rem] font-black text-text-muted uppercase tracking-widest">Department</p>
                                    <p className="font-bold text-text-main">{profile?.department?.name || 'Academic Common'}</p>
                                </div>
                            </div>
                            
                            {user?.role === 'Student' && (
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner"><GraduationCap size={20} /></div>
                                    <div>
                                        <p className="text-[0.65rem] font-black text-text-muted uppercase tracking-widest">Program</p>
                                        <p className="font-bold text-text-main">{profile?.program?.name || 'N/A'}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner"><MapPin size={20} /></div>
                                <div>
                                    <p className="text-[0.65rem] font-black text-text-muted uppercase tracking-widest">Campus Location</p>
                                    <p className="font-bold text-text-main">Main Corporate Block</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const InfoField = ({ label, value, icon, isEditing, onChange }) => (
    <div className="space-y-2">
        <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5 ml-1">
            {icon} {label}
        </label>
        {isEditing ? (
            <input 
                type="text" 
                defaultValue={value} 
                onChange={e => onChange(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-border-custom/50 rounded-xl py-2.5 px-4 text-sm font-bold text-text-main outline-none focus:border-primary transition-all shadow-inner"
            />
        ) : (
            <div className="w-full py-2.5 px-4 bg-black/5 dark:bg-white/5 border border-transparent rounded-xl text-sm font-bold text-text-main/80 overflow-hidden text-ellipsis">
                {value}
            </div>
        )}
    </div>
);

export default ProfilePage;
