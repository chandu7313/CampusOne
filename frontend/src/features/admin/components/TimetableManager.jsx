import React from 'react';
import { useNavigate } from 'react-router-dom';
import TimetableManagerPage from './timetable/TimetableManagerPage';

/**
 * Timetable Module Entry Point — dashboard only.
 * CREATE and EDIT flows now live on their own URL routes:
 *   /admin/timetable/new        → CreateTimetablePage
 *   /admin/timetable/:id/edit   → EditTimetablePage
 *
 * React mounts a fresh component instance per URL, so there is zero stale
 * state bleed between sessions — no Redux clearActiveTimetable needed.
 */
const TimetableManager = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg-main p-4 md:p-8">
            <TimetableManagerPage
                onCreateClick={() => navigate('/admin/timetable/new')}
                onEditClick={(tt) => navigate(`/admin/timetable/${tt.id}/edit`)}
                onViewClick={(tt) => navigate(`/admin/timetable/${tt.id}/edit`)}
            />
        </div>
    );
};

export default TimetableManager;
