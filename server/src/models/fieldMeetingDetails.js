module.exports = function (sequelize, DataTypes) {
    const FieldMeetingDetails = sequelize.define('FieldMeetingDetails', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        day_plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'day_plans',  // Table name of the referenced model
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact_number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [10, 10]
            }
        },
        industry: {
            type: DataTypes.STRING,
            allowNull: false
        },
        client_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        meeting_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        meeting_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        follow_up_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'field_meeting_details'
    });

    return FieldMeetingDetails;
};
