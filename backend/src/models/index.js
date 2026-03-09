import User from '../modules/users/models/user.model.js';
import FacultyProfile from '../modules/users/models/facultyProfile.model.js';
import HODProfile from '../modules/users/models/hodProfile.model.js';
import StaffProfile from '../modules/users/models/staffProfile.model.js';
import { AuditLog, SystemConfig } from '../modules/admin/models/index.js';
import {
    Department, Program, Course,
    Semester, Section, StudentSection, SemesterSubject,
    Classroom, TimeSlot, TimetableEntry,
    FacultySubject, FacultyAssignment, Attendance
} from '../modules/academics/models/index.js';
import { StudentProfile, Enrollment, AdmissionLog } from '../modules/students/models/index.js';
import { FeeStructure, StudentFee, Scholarship } from '../modules/finance/models/index.js';
import {
    Exam, SubjectExam, ExamHallAssignment, ExamResult
} from '../modules/exams/models/index.js';
import {
    Holiday, Event, Announcement, EventRegistration
} from '../modules/admin/models/index.js';
import { Assignment, AssignmentSubmission } from '../modules/assignments/models/index.js';
import { Message } from '../modules/communication/models/index.js';
import { PlacementRecord, PlacementOpportunity, PlacementApplication } from '../modules/placements/models/index.js';

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

// Semester Hierarchy
Program.hasMany(Semester, { foreignKey: 'programId', as: 'semesters' });
Semester.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

Semester.belongsToMany(Course, { through: SemesterSubject, foreignKey: 'semesterId', as: 'subjects' });
Course.belongsToMany(Semester, { through: SemesterSubject, foreignKey: 'subjectId', as: 'semesters' });

Semester.hasMany(Section, { foreignKey: 'semesterId', as: 'sections' });
Section.belongsTo(Semester, { foreignKey: 'semesterId', as: 'semester' });

// Section Allocation
Section.belongsToMany(StudentProfile, { through: StudentSection, foreignKey: 'sectionId', as: 'students' });
StudentProfile.belongsToMany(Section, { through: StudentSection, foreignKey: 'studentProfileId', as: 'sections' });

// Timetable
TimeSlot.hasMany(TimetableEntry, { foreignKey: 'timeSlotId', as: 'entries' });
TimetableEntry.belongsTo(TimeSlot, { foreignKey: 'timeSlotId', as: 'timeSlot' });

Classroom.hasMany(TimetableEntry, { foreignKey: 'classroomId', as: 'entries' });
TimetableEntry.belongsTo(Classroom, { foreignKey: 'classroomId', as: 'classroom' });

Section.hasMany(TimetableEntry, { foreignKey: 'sectionId', as: 'timetableEntries' });
TimetableEntry.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

Course.hasMany(TimetableEntry, { foreignKey: 'subjectId', as: 'timetableEntries' });
TimetableEntry.belongsTo(Course, { foreignKey: 'subjectId', as: 'subject' });

User.hasMany(TimetableEntry, { foreignKey: 'facultyId', as: 'lectures' });
TimetableEntry.belongsTo(User, { foreignKey: 'facultyId', as: 'faculty' });

// Faculty Detailed Associations
Department.hasMany(FacultyProfile, { foreignKey: 'departmentId', as: 'facultyMembers' });
FacultyProfile.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

FacultyProfile.belongsToMany(Course, { through: FacultySubject, foreignKey: 'facultyProfileId', as: 'competencies' });
Course.belongsToMany(FacultyProfile, { through: FacultySubject, foreignKey: 'subjectId', as: 'qualifiedFaculty' });

FacultyProfile.hasMany(FacultyAssignment, { foreignKey: 'facultyProfileId', as: 'assignments' });
FacultyAssignment.belongsTo(FacultyProfile, { foreignKey: 'facultyProfileId', as: 'faculty' });

Section.hasMany(FacultyAssignment, { foreignKey: 'sectionId', as: 'facultyAssignments' });
FacultyAssignment.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

// Exam Associations
Exam.hasMany(SubjectExam, { foreignKey: 'examId', as: 'papers' });
SubjectExam.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

SubjectExam.belongsTo(Course, { foreignKey: 'subjectId', as: 'subject' });
SubjectExam.hasMany(ExamHallAssignment, { foreignKey: 'subjectExamId', as: 'hallAssignments' });

ExamHallAssignment.belongsTo(Classroom, { foreignKey: 'classroomId', as: 'hall' });
ExamHallAssignment.belongsTo(User, { foreignKey: 'facultyId', as: 'invigilator' });

SubjectExam.hasMany(ExamResult, { foreignKey: 'subjectExamId', as: 'results' });
ExamResult.belongsTo(SubjectExam, { foreignKey: 'subjectExamId', as: 'paper' });
ExamResult.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Student <-> Academic
Program.hasMany(StudentProfile, { foreignKey: 'programId', as: 'students' });
StudentProfile.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

StudentProfile.hasMany(Enrollment, { foreignKey: 'studentProfileId', as: 'enrollments' });
Enrollment.belongsTo(StudentProfile, { foreignKey: 'studentProfileId', as: 'student' });

Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Attendance
User.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Attendance.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

Course.hasMany(Attendance, { foreignKey: 'subjectId', as: 'subjectAttendances' });
Attendance.belongsTo(Course, { foreignKey: 'subjectId', as: 'subject' });

User.hasMany(Attendance, { foreignKey: 'facultyId', as: 'markedAttendances' });
Attendance.belongsTo(User, { foreignKey: 'facultyId', as: 'faculty' });

// Finance Associations
Program.hasMany(FeeStructure, { foreignKey: 'programId', as: 'feeStructures' });
FeeStructure.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

StudentProfile.hasMany(StudentFee, { foreignKey: 'studentProfileId', as: 'fees' });
StudentFee.belongsTo(StudentProfile, { foreignKey: 'studentProfileId', as: 'student' });

FeeStructure.hasMany(StudentFee, { foreignKey: 'feeStructureId', as: 'studentFees' });
StudentFee.belongsTo(FeeStructure, { foreignKey: 'feeStructureId', as: 'feeStructure' });

StudentProfile.hasMany(Scholarship, { foreignKey: 'studentProfileId', as: 'scholarships' });
Scholarship.belongsTo(StudentProfile, { foreignKey: 'studentProfileId', as: 'student' });

// Announcements
User.hasMany(Announcement, { foreignKey: 'authorId', as: 'announcements' });
Announcement.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Events & Registrations
Event.hasMany(EventRegistration, { foreignKey: 'eventId', as: 'registrations' });
EventRegistration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

User.hasMany(EventRegistration, { foreignKey: 'userId', as: 'eventRegistrations' });
EventRegistration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Assignments
Course.hasMany(Assignment, { foreignKey: 'subjectId', as: 'assignments' });
Assignment.belongsTo(Course, { foreignKey: 'subjectId', as: 'subject' });

Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignmentId', as: 'submissions' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });

User.hasMany(AssignmentSubmission, { foreignKey: 'studentId', as: 'assignmentSubmissions' });
AssignmentSubmission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Messages (Communications)
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Placements
User.hasMany(PlacementRecord, { foreignKey: 'studentId', as: 'placementRecords' });
PlacementRecord.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

PlacementOpportunity.hasMany(PlacementApplication, { foreignKey: 'opportunityId', as: 'applications' });
PlacementApplication.belongsTo(PlacementOpportunity, { foreignKey: 'opportunityId', as: 'opportunity' });

User.hasMany(PlacementApplication, { foreignKey: 'studentId', as: 'placementApplications' });
PlacementApplication.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

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
    Semester,
    Section,
    StudentSection,
    SemesterSubject,
    Classroom,
    TimeSlot,
    TimetableEntry,
    FacultySubject,
    FacultyAssignment,
    StudentProfile,
    Enrollment,
    AdmissionLog,
    FeeStructure,
    StudentFee,
    Scholarship,
    Exam,
    SubjectExam,
    ExamHallAssignment,
    ExamResult,
    Holiday,
    Event,
    Announcement,
    Assignment,
    AssignmentSubmission,
    Message,
    PlacementRecord,
    PlacementOpportunity,
    PlacementApplication,
    EventRegistration,
    Attendance
};
