import User from '../../users/models/user.model.js';
import { Program, Course } from '../../academics/models/index.js';
import StudentProfile from './studentProfile.model.js';
import Enrollment from './enrollment.model.js';

// User <-> StudentProfile
User.hasOne(StudentProfile, { foreignKey: 'userId', as: 'studentProfile' });
StudentProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Program <-> StudentProfile
Program.hasMany(StudentProfile, { foreignKey: 'programId', as: 'students' });
StudentProfile.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

// StudentProfile <-> Enrollment
StudentProfile.hasMany(Enrollment, { foreignKey: 'studentProfileId', as: 'enrollments' });
Enrollment.belongsTo(StudentProfile, { foreignKey: 'studentProfileId', as: 'student' });

// Course <-> Enrollment
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

export {
    StudentProfile,
    Enrollment
};
