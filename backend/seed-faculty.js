import { sequelize } from './src/config/database.js';
import { User, FacultyProfile, Department } from './src/models/index.js';
import bcrypt from 'bcryptjs';

const seedFaculty = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const departments = await Department.findAll();
        if (!departments || departments.length === 0) {
            console.log('No departments found. Please seed departments first.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('password123', 12);

        let createdCount = 0;

        for (const dept of departments) {
            // Create 3 dummy faculty for each department
            for (let i = 1; i <= 3; i++) {
                const uniqueHash = Math.random().toString(36).substring(7);
                const email = `faculty.${dept.code.toLowerCase()}.${i}_${uniqueHash}@campusone.edu`;

                // Check if user exists
                const existingUser = await User.findOne({ where: { email } });
                if (!existingUser) {
                    const fname = ['Dr.', 'Prof.', 'Mr.', 'Ms.'][Math.floor(Math.random() * 4)];
                    const lname = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][Math.floor(Math.random() * 10)];

                    const user = await User.create({
                        firstName: fname,
                        lastName: lname,
                        email: email,
                        password: hashedPassword,
                        role: 'Faculty',
                        status: 'Active'
                    });

                    await FacultyProfile.create({
                        userId: user.id,
                        employeeId: `EMP-${dept.code}-${user.id.substring(0, 4).toUpperCase()}`,
                        departmentId: dept.id,
                        designation: 'Assistant Professor',
                        joiningDate: new Date(),
                        maxWeeklyHours: parseInt(Math.random() * 10 + 20), // 20-30 hours
                        expertise: ['General', 'Specialized']
                    });

                    createdCount++;
                }
            }
        }

        console.log(`Successfully seeded ${createdCount} faculty members workflows!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding faculty:', error);
        process.exit(1);
    }
};

seedFaculty();
