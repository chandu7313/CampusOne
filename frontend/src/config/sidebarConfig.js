import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    ClipboardCheck,
    TrendingUp,
    Wallet,
    Settings,
    ShieldCheck,
    FileText,
    Calendar,
    ClipboardList
} from 'lucide-react';

export const roleMenus = {
    Admin: [
        { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: GraduationCap, label: 'Academic Control', path: '/admin/academic' },
        { icon: Calendar, label: 'Timetable Manager', path: '/admin/timetable' },
        { icon: Users, label: 'Faculty Load', path: '/admin/faculty' },
        { icon: ClipboardList, label: 'Student Console', path: '/admin/students' },
        { icon: FileText, label: 'Exam Console', path: '/admin/exams' },
        { icon: Wallet, label: 'Finance Control', path: '/admin/finance' },
        { icon: Settings, label: 'System Config', path: '/admin/config' },
        { icon: ShieldCheck, label: 'File Governance', path: '/admin/files' },
    ],
    HOD: [
        { icon: LayoutDashboard, label: 'Dept Dashboard', path: '/hod/dashboard' },
        { icon: Users, label: 'Department Staff', path: '/hod/staff' },
        { icon: GraduationCap, label: 'Student Oversight', path: '/hod/students' },
        { icon: Calendar, label: 'Academic Planner', path: '/hod/planner' },
    ],
    Faculty: [
        { icon: LayoutDashboard, label: 'Faculty Dashboard', path: '/faculty/dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/faculty/courses' },
        { icon: ClipboardCheck, label: 'Attendance', path: '/faculty/attendance' },
        { icon: TrendingUp, label: 'Assignments', path: '/faculty/assignments' },
    ],
    Student: [
        { icon: LayoutDashboard, label: 'Student Dashboard', path: '/student/dashboard' },
        { icon: BookOpen, label: 'Course Catalog', path: '/student/courses' },
        { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
        { icon: ClipboardList, label: 'My Grades', path: '/student/grades' },
        { icon: Wallet, label: 'Fee Status', path: '/student/fees' },
    ],
    Finance: [
        { icon: LayoutDashboard, label: 'Finance Dashboard', path: '/finance/dashboard' },
        { icon: Wallet, label: 'Transactions', path: '/finance/transactions' },
        { icon: FileText, label: 'Fee Reports', path: '/finance/reports' },
        { icon: ClipboardCheck, label: 'Payroll', path: '/finance/payroll' },
    ]
};
