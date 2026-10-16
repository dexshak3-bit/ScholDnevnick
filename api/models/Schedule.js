const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Schedule', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: "schedules_date_lesson_number_teacher_id_key"
    },
    lesson_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "schedules_date_lesson_number_teacher_id_key"
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'id'
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id'
      },
      unique: "schedules_date_lesson_number_teacher_id_key"
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id'
      },
      unique: "schedules_date_lesson_number_class_id_key"
    },
    classroom_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classrooms',
        key: 'id'
      },
      unique: "schedules_date_lesson_number_classroom_id_key"
    }
  }, {
    sequelize,
    tableName: 'schedules',
    timestamps: false,
    indexes: [
      {
        name: "idx_schedules_date",
        fields: [
          { name: "date" },
        ]
      },
      {
        name: "schedules_date_lesson_number_class_id_key",
        unique: true,
        fields: [
          { name: "date" },
          { name: "lesson_number" },
          { name: "class_id" },
        ]
      },
      {
        name: "schedules_date_lesson_number_classroom_id_key",
        unique: true,
        fields: [
          { name: "date" },
          { name: "lesson_number" },
          { name: "classroom_id" },
        ]
      },
      {
        name: "schedules_date_lesson_number_teacher_id_key",
        unique: true,
        fields: [
          { name: "date" },
          { name: "lesson_number" },
          { name: "teacher_id" },
        ]
      },
      {
        name: "schedules_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
