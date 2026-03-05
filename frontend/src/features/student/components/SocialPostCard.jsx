import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, Users, MoreVertical } from 'lucide-react';
import logo from '../../../assets/campusone_logo.png';

const SocialPostCard = ({ post }) => {
    return (
        <div className="bg-bg-card overflow-hidden group border border-border-custom hover:border-primary/30 transition-all duration-500 rounded-2xl shadow-sm">
            <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center p-1 ring-2 ring-primary/10">
                        <img src={logo} alt="C1" className="w-full h-full rounded-full bg-white object-contain" fallback={<Users className="text-white" size={12} />} />
                    </div>
                    <div>
                        <span className="text-[0.7rem] font-black text-text-main group-hover:text-primary transition-colors">CampusOne Official</span>
                        <p className="text-[0.55rem] text-text-muted flex items-center gap-1 uppercase tracking-widest font-bold opacity-70">2h ago • Feed</p>
                    </div>
                </div>
                <MoreVertical size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
            </div>

            <div className="aspect-[4/5] bg-black/5 dark:bg-white/5 relative overflow-hidden border-y border-border-custom/30">
                <img 
                    src={post.image || "https://images.unsplash.com/photo-1541339907198-e08756ebafe1?auto=format&fit=crop&q=80&w=800"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out" 
                    alt="Social feed" 
                />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-3">
                        <Heart size={18} className="text-rose-500 cursor-pointer transition-transform hover:scale-125" fill="#f43f5e" />
                        <MessageCircle size={18} className="text-text-main cursor-pointer hover:text-primary transition-colors" />
                        <Send size={18} className="text-text-main cursor-pointer hover:rotate-12 transition-all" />
                    </div>
                    <Bookmark size={18} className="text-text-muted cursor-pointer hover:text-primary transition-colors" />
                </div>
                
                <div className="flex flex-col gap-1">
                    <span className="text-[0.65rem] font-black text-text-main">{post.likes || 1245} likes</span>
                    <p className="text-[0.75rem] leading-relaxed text-text-muted line-clamp-2">
                        <span className="font-black text-text-main mr-2">campusone</span>
                        {post.caption || "Exploring the new library wing designed for sustainability and collaborative learning."}
                    </p>
                    <button className="text-[0.6rem] font-bold text-text-muted mt-1.5 w-fit bg-transparent border-none cursor-pointer hover:text-primary transition-all p-0">View all comments</button>
                </div>
            </div>
        </div>
    );
};

export default SocialPostCard;
