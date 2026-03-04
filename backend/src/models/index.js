import User from '../modules/users/models/user.model.js';
import FacultyProfile from '../modules/users/models/facultyProfile.model.js';
import HODProfile from '../modules/users/models/hodProfile.model.js';
import StaffProfile from '../modules/users/models/staffProfile.model.js';
import { AuditLog, SystemConfig } from '../modules/admin/models/index.js';
import { Department, Program, Course } from '../modules/academics/models/index.js';
import { StudentProfile, Enrollment } from '../modules/students/models/index.js';
import { FeeStructure, StudentFee, Scholarship } from '../modules/finance/models/index.js';

/**
 * This index file serves as the single point of truth for all models.
 * Importing these here ensures that all associations defined in sub-module
 * index.js files are actually executed by the JS engine during startup.
 */

// User <-> Profiles (1:1)
User.hasOne(StudentProfile, { foreignKey: 'userId', as: 'studentProfile' });
StudentProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(FacultyProfile, { foreignKey: 'userId', as: 'facultyProfile' });
FacultyProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(HODProfile, { foreignKey: 'userId', as: 'hodProfile' });
HODProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(StaffProfile, { foreignKey: 'userId', as: 'staffProfile' });
StaffProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Audit logs
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Academic Associations
Department.hasMany(Program, { foreignKey: 'departmentId', as: 'programs' });
Program.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

Program.hasMany(Course, { foreignKey: 'programId', as: 'courses' });
Course.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

// Student <-> Academic
Program.hasMany(StudentProfile, { foreignKey: 'programId', as: 'students' });
StudentProfile.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

StudentProfile.hasMany(Enrollment, { foreignKey: 'studentProfileId', as: 'enrollments' });
Enrollment.belongsTo(StudentProfile, { foreignKey: 'studentProfileId', as: 'student' });

Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Finance Associations
Program.hasMany(FeeStructure, { foreignKey: 'programId', as: 'feeStructures' });
FeeStructure.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

StudentProfile.hasMany(StudentFee, { foreignKey: 'studentProfileId', as: 'fees' });
StudentFee.belongsTo(StudentProfile, { foreignKey: 'studentProfileId', as: 'student' });

FeeStructure.hasMany(StudentFee, { foreignKey: 'feeStructureId', as: 'studentFees' });
StudentFee.belongsTo(FeeStructure, { foreignKey: 'feeStructureId', as: 'feeStructure' });

StudentProfile.hasMany(Scholarship, { foreignKey: 'studentProfileId', as: 'scholarships' });
Scholarship.belongsTo(StudentProfile, { foreignKey: 'studentProfileId', as: 'student' });

export {
    User,
    FacultyProfile,
    HODProfile,
    StaffProfile,
    AuditLog,
    SystemConfig,
    Department,
    Program,
    Course,
    StudentProfile,
    Enrollment,
    FeeStructure,
    StudentFee,
    Scholarship
};
