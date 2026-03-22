import React, { useState, useMemo } from 'react';
import { X, Zap, Info, Check, ChevronRight } from 'lucide-react';
import { useInitializeProgram } from '../hooks/useAcademics';
import { useToast } from '../../../hooks/useToast';

/**
 * InitializeSemestersModal
 *
 * Props:
 *   isOpen       — boolean
 *   onClose      — () => void
 *   program      — { id, name, durationYears, years: [{semesters:[]}] }
 */
const InitializeSemestersModal = ({ isOpen, onClose, program }) => {
    const { toast } = useToast();
    const initializeMutation = useInitializeProgram();

    const [sectionsPerSemester, setSectionsPerSemester] = useState(2);
    const [maxStrength, setMaxStrength] = useState(60);
    const [sectionNamesRaw, setSectionNamesRaw] = useState('A, B');

    const sectionNames = useMemo(
        () => sectionNamesRaw.split(',').map(s => s.trim()).filter(Boolean),
        [sectionNamesRaw]
    );

    const totalSemesters = program?.years?.reduce((acc, y) => acc + (y.semesters?.length || 0), 0) || 0;
    const totalYears = program?.years?.length || 0;
    const effectiveSections = Math.min(sectionsPerSemester, sectionNames.length || sectionsPerSemester);
    const totalSectionsPreview = totalSemesters * effectiveSections;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!program?.id) return;

        try {
            const result = await initializeMutation.mutateAsync({
                programId: program.id,
                sectionsPerSemester: effectiveSections,
                defaultSectionNames: sectionNames.slice(0, effectiveSections),
                maxStrength: Number(maxStrength)
            });
            toast(
                `✓ Initialized: ${totalYears} years, ${totalSemesters} semesters, ${result.sectionsCreated ?? totalSectionsPreview} sections`,
                'success'
            );
            onClose();
        } catch (err) {
            toast(err.response?.data?.message || 'Initialization failed', 'error');
        }
    };

    if (!isOpen || !program) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-bg-card border border-border-custom rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-border-custom bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Zap size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="font-black text-text-main text-[0.95rem]">Initialize Semesters</h3>
                            <p className="text-[0.65rem] text-text-muted font-bold">{program.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-main rounded-xl transition-colors border-none cursor-pointer text-text-muted">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Live Preview */}
                    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Info size={14} className="text-primary" />
                            <span className="text-[0.65rem] font-black text-primary uppercase tracking-widest">Preview</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Years', value: totalYears },
                                { label: 'Semesters', value: totalSemesters },
                                { label: 'Sections', value: totalSectionsPreview }
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-bg-card rounded-xl p-3 text-center">
                                    <p className="text-2xl font-black text-primary">{value}</p>
                                    <p className="text-[0.6rem] font-bold text-text-muted uppercase tracking-wider">{label}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-[0.65rem] text-text-muted font-semibold text-center mt-1">
                            {sectionNames.slice(0, effectiveSections).join(', ')} per semester • {maxStrength} students/section max
                        </p>
                    </div>

                    {/* Sections per semester */}
                    <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1">
                            Sections per Semester
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            value={sectionsPerSemester}
                            onChange={e => setSectionsPerSemester(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                        />
                    </div>

                    {/* Section names */}
                    <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1">
                            Section Names <span className="normal-case font-normal">(comma-separated)</span>
                        </label>
                        <input
                            type="text"
                            value={sectionNamesRaw}
                            onChange={e => setSectionNamesRaw(e.target.value)}
                            placeholder="A, B, C, D"
                            className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                        />
                        <p className="text-[0.6rem] text-text-muted pl-1">
                            Only the first <strong>{effectiveSections}</strong> name(s) will be used.
                        </p>
                    </div>

                    {/* Max strength */}
                    <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1">
                            Max Students per Section
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={maxStrength}
                            onChange={e => setMaxStrength(Math.max(1, parseInt(e.target.value) || 60))}
                            className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={initializeMutation.isPending || totalSemesters === 0}
                        className="w-full bg-primary text-white py-3.5 rounded-2xl font-black hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 border-none cursor-pointer flex items-center justify-center gap-2"
                    >
                        {initializeMutation.isPending ? (
                            'Initializing...'
                        ) : (
                            <><Check size={18} /> Initialize {totalSectionsPreview} Sections</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InitializeSemestersModal;
