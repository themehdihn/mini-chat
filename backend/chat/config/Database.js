import { Sequelize } from 'sequelize';

const db = new Sequelize('database_name', 'your_mysql_user', 'your_mysql_password', {
    host: 'localhost',
    dialect: 'mysql',
});

export default db;
