import { Program } from '../../academics/models/index.js';
import { StudentProfile } from '../../students/models/index.js';
import FeeStructure from './feeStructure.model.js';
import StudentFee from './studentFee.model.js';
import Scholarship from './scholarship.model.js';

// Program <-> FeeStructure
Program.hasMany(FeeStructure, { foreignKey: 'programId', as: 'feeStructures' });
FeeStructure.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

// StudentProfile <-> StudentFee
StudentProfile.hasMany(StudentFee, { foreignKey: 'studentProfileId', as: 'fees' });
StudentFee.belongsTo(StudentProfile, { foreignKey: 'studentProfileId', as: 'student' });

// FeeStructure <-> StudentFee
FeeStructure.hasMany(StudentFee, { foreignKey: 'feeStructureId', as: 'studentFees' });
StudentFee.belongsTo(FeeStructure, { foreignKey: 'feeStructureId', as: 'feeStructure' });

// StudentProfile <-> Scholarship
StudentProfile.hasMany(Scholarship, { foreignKey: 'studentProfileId', as: 'scholarships' });
Scholarship.belongsTo(StudentProfile, { foreignKey: 'studentProfileId', as: 'student' });

export {
    FeeStructure,
    StudentFee,
    Scholarship
};
