import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
    success: <CheckCircle size={18} className="text-emerald-400 shrink-0" />,
    error:   <XCircle    size={18} className="text-rose-400 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
};

const BG = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    error:   'bg-rose-500/10 border-rose-500/20',
    warning: 'bg-amber-500/10 border-amber-500/20',
};

const TEXT = {
    success: 'text-emerald-300',
    error:   'text-rose-300',
    warning: 'text-amber-300',
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const counterRef = useRef(0);

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback((message, type = 'success', duration = 4000) => {
        const id = ++counterRef.current;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`
                            flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl
                            pointer-events-auto min-w-[280px] max-w-[420px]
                            animate-in slide-in-from-right-4 fade-in duration-300
                            ${BG[t.type]}
                        `}
                    >
                        {ICONS[t.type]}
                        <span className={`flex-1 text-sm font-semibold ${TEXT[t.type]}`}>{t.message}</span>
                        <button
                            onClick={() => dismiss(t.id)}
                            className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white/80 cursor-pointer border-none bg-transparent"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
};
