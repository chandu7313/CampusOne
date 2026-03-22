import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Reusable ConfirmDialog — supports two modes:
 *
 * ① Simple confirm (default):
 *     Just shows title + description with Cancel / Confirm buttons.
 *
 * ② Typed-name confirm (pass `requireTyped`):
 *     Admin must type the exact `requireTyped` string before the
 *     Confirm button is enabled. Used for irreversible/destructive actions.
 *
 * Props:
 *   isOpen          — boolean
 *   onClose         — () => void
 *   onConfirm       — () => void
 *   title           — string
 *   description     — string (can include counts / details)
 *   confirmLabel    — string (default "Confirm")
 *   confirmVariant  — 'danger' | 'primary'
 *   isLoading       — boolean
 *   requireTyped    — string | undefined — when provided, user must type this exact value
 *   typedLabel      — string — label shown above the input (default: the requireTyped value)
 */
const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    confirmVariant = 'danger',
    isLoading = false,
    requireTyped,
    typedLabel,
}) => {
    const [typed, setTyped] = useState('');

    // Reset typed text whenever the dialog opens/closes
    useEffect(() => {
        if (!isOpen) setTyped('');
    }, [isOpen]);

    // Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isTypedMode = Boolean(requireTyped);
    const isConfirmed = isTypedMode ? typed.trim() === requireTyped : true;

    const confirmClasses = confirmVariant === 'danger'
        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
        : 'bg-primary hover:bg-primary/90 text-white shadow-primary/30';

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-bg-card border border-border-custom rounded-[32px] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-8 space-y-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2
                        ${confirmVariant === 'danger' ? 'bg-rose-500/10' : 'bg-primary/10'}`}>
                        <AlertTriangle size={28} className={confirmVariant === 'danger' ? 'text-rose-500' : 'text-primary'} />
                    </div>

                    <h3 className="text-xl font-black text-text-main">{title}</h3>
                    <p className="text-sm text-text-muted font-medium leading-relaxed">{description}</p>

                    {/* Typed confirmation field */}
                    {isTypedMode && (
                        <div className="space-y-2 pt-1">
                            <p className="text-[0.72rem] text-text-muted font-semibold">
                                Type <span className="font-black text-text-main">{typedLabel ?? requireTyped}</span> to confirm:
                            </p>
                            <input
                                type="text"
                                value={typed}
                                autoFocus
                                onChange={e => setTyped(e.target.value)}
                                placeholder={`Type "${requireTyped}"…`}
                                className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-rose-400 transition-all"
                            />
                        </div>
                    )}
                </div>

                <div className="px-8 pb-8 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm text-text-muted hover:bg-bg-main transition-all border border-border-custom cursor-pointer bg-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading || !isConfirmed}
                        className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all border-none cursor-pointer shadow-xl
                            hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0 disabled:cursor-not-allowed
                            ${confirmClasses}`}
                    >
                        {isLoading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
