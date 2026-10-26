const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Grade', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schedules',
        key: 'id'
      },
      unique: "grades_schedule_id_student_id_key"
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      },
      unique: "grades_schedule_id_student_id_key"
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'grades',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "grades_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "grades_schedule_id_student_id_key",
        unique: true,
        fields: [
          { name: "schedule_id" },
          { name: "student_id" },
        ]
      },
      {
        name: "idx_grades_schedule_id",
        fields: [
          { name: "schedule_id" },
        ]
      },
      {
        name: "idx_grades_student_id",
        fields: [
          { name: "student_id" },
        ]
      },
    ]
  });
};
