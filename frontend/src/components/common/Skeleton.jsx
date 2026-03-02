export const Skeleton = ({ width, height, borderRadius, className }) => (
  <div 
    className={`skeleton ${className || ''}`} 
    style={{ width, height, borderRadius: borderRadius || '4px' }}
  />
);

export const CardSkeleton = () => (
  <div className="p-6 rounded-2xl bg-white/3 border border-white/5 flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <Skeleton width="48px" height="48px" borderRadius="12px" />
      <Skeleton width="60px" height="20px" borderRadius="8px" />
    </div>
    <Skeleton width="70%" height="32px" borderRadius="8px" />
    <Skeleton width="40%" height="16px" borderRadius="6px" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="flex flex-col gap-4 p-4">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-6 items-center">
        <Skeleton width="15%" height="16px" borderRadius="6px" />
        <Skeleton width="40%" height="16px" borderRadius="6px" />
        <Skeleton width="15%" height="16px" borderRadius="6px" />
        <Skeleton width="20%" height="16px" borderRadius="6px" />
      </div>
    ))}
  </div>
);
