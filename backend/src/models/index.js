import User from '../modules/users/models/user.model.js';
import { AuditLog, SystemConfig } from '../modules/admin/models/index.js';
import { Department, Program, Course } from '../modules/academics/models/index.js';
import { StudentProfile, Enrollment } from '../modules/students/models/index.js';
import { FeeStructure, StudentFee, Scholarship } from '../modules/finance/models/index.js';

/**
 * This index file serves as the single point of truth for all models.
 * Importing these here ensures that all associations defined in sub-module
 * index.js files are actually executed by the JS engine during startup.
 */

export {
    User,
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
