import React from 'react';
import { Star, Award, Users } from 'lucide-react';

const highlights = [
  {
    icon: <Star className="text-yellow-400" size={24} />,
    label: "NAAC Rating",
    value: "A++ Grade",
    description: "Highest academic excellence recognized nationwide."
  },
  {
    icon: <Award className="text-blue-400" size={24} />,
    label: "NIRF Ranking",
    value: "Top 50",
    description: "Ranked among the premier institutions in India."
  },
  {
    icon: <Users className="text-green-400" size={24} />,
    label: "Community",
    value: "50,000+",
    description: "A vibrant ecosystem of students and alumni."
  }
];

export default function UniversityHighlights() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 px-4 py-2">
      {/* High-level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item, index) => (
          <div 
            key={index} 
            className="glass p-5 rounded-2xl border border-white/5 flex flex-col gap-3 hover:border-primary/30 transition-all duration-300 group"
          >
            <div className="p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div>
              <h4 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{item.label}</h4>
              <div className="text-xl font-bold text-text-main mb-1">{item.value}</div>
              <p className="text-text-muted text-xs leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
