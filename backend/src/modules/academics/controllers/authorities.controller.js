import { Department, User, FacultyProfile, HODProfile } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';

/**
 * Get university hierarchy and authorities
 */
export const getAuthorities = catchAsync(async (req, res, next) => {
    // 1. Fetch departments with their HODs and faculty
    const departments = await Department.findAll({
        include: [
            {
                model: FacultyProfile,
                as: 'facultyMembers',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName', 'email', 'avatar', 'role']
                }]
            }
        ]
    });

    // 2. Fetch HODs separately to identify leadership
    const hods = await HODProfile.findAll({
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'avatar']
            },
            {
                model: Department,
                as: 'department',
                attributes: ['name', 'code']
            }
        ]
    });

    // 3. Construct the response
    const leadership = [
        {
            role: 'Vice Chancellor',
            name: 'Dr. Arthur Sterling',
            email: 'vc@campusone.edu',
            avatar: null
        },
        {
            role: 'Registrar',
            name: 'Prof. Elena Vance',
            email: 'registrar@campusone.edu',
            avatar: null
        },
        {
            role: 'Dean of Academics',
            name: 'Dr. Sarah Connor',
            email: 'dean.acad@campusone.edu',
            avatar: null
        }
    ];

    res.status(200).json({
        status: 'success',
        data: {
            leadership,
            hods,
            departments: departments.map(dept => ({
                id: dept.id,
                name: dept.name,
                code: dept.code,
                facultyCount: dept.facultyMembers?.length || 0,
                faculty: dept.facultyMembers?.map(f => ({
                    name: `${f.user.firstName} ${f.user.lastName}`,
                    email: f.user.email,
                    designation: f.designation || 'Faculty',
                    avatar: f.user.avatar
                }))
            }))
        }
    });
});
