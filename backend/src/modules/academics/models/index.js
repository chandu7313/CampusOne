import Department from './department.model.js';
import Program from './program.model.js';
import Course from './course.model.js';

// Department <-> Program
Department.hasMany(Program, { foreignKey: 'departmentId', as: 'programs' });
Program.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// Program <-> Course
Program.hasMany(Course, { foreignKey: 'programId', as: 'courses' });
Course.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

export {
    Department,
    Program,
    Course
};
