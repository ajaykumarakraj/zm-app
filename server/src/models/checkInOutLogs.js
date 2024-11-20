module.exports = function (sequelize, DataTypes) {
    const CheckInOutLogs = sequelize.define('CheckInOutLogs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        day_plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'day_plans',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        check_in_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        check_in_location: {
            type: DataTypes.JSON,
            allowNull: true
        },
        check_out_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        check_out_location: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'check_in_out_logs'
    });

    return CheckInOutLogs;
};
