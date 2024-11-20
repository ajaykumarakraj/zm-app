const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
});

// Import models
const Users = require('./users')(sequelize, Sequelize);
const DayPlans = require('./dayPlans')(sequelize, Sequelize);
const FieldMeetingDetails = require('./fieldMeetingDetails')(sequelize, Sequelize);
const CheckInOutLogs = require('./checkInOutLogs')(sequelize, Sequelize);

// Define Relations
Users.hasMany(DayPlans, { foreignKey: 'added_by', as: 'dayplans' });
DayPlans.belongsTo(Users, { foreignKey: 'added_by', as: 'user' });

DayPlans.hasMany(FieldMeetingDetails, { foreignKey: 'day_plan_id', as: 'meetingDetails' });
FieldMeetingDetails.belongsTo(DayPlans, { foreignKey: 'day_plan_id', as: 'dayPlan' });

// One-to-many: A user can have multiple check-in/check-out logs
Users.hasMany(CheckInOutLogs, { foreignKey: 'user_id', as: 'checkInOutLogs' });
CheckInOutLogs.belongsTo(Users, { foreignKey: 'user_id', as: 'user' });

// One-to-many: A day plan can have multiple check-in/check-out logs
DayPlans.hasMany(CheckInOutLogs, { foreignKey: 'day_plan_id', as: 'checkInOutLogs' });
CheckInOutLogs.belongsTo(DayPlans, { foreignKey: 'day_plan_id', as: 'dayPlan' });

// Sync and authenticate the connection
const Connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected');

        await sequelize.sync()
            .then(() => {
                console.log('Models synchronized');
            })
            .catch((err) => {
                console.error('Error syncing models:', err);
            });

    } catch (error) {
        console.error('MySQL database connection error:', error);
    }
};

module.exports = { Connection, Users, DayPlans, FieldMeetingDetails, CheckInOutLogs };
