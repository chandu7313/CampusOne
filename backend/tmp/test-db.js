import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const testConn = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connection HAS BEEN ESTABLISHED successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

testConn();
