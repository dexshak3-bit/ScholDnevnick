var DataTypes = require("sequelize").DataTypes;
var _Class = require("./Class");
var _Classroom = require("./Classroom");
var _Grade = require("./Grade");
var _Schedule = require("./Schedule");
var _SchoolSetting = require("./SchoolSetting");
var _Student = require("./Student");
var _Subject = require("./Subject");
var _Teacher = require("./Teacher");
var _User = require("./User");

function initModels(sequelize) {
  var Class = _Class(sequelize, DataTypes);
  var Classroom = _Classroom(sequelize, DataTypes);
  var Grade = _Grade(sequelize, DataTypes);
  var Schedule = _Schedule(sequelize, DataTypes);
  var SchoolSetting = _SchoolSetting(sequelize, DataTypes);
  var Student = _Student(sequelize, DataTypes);
  var Subject = _Subject(sequelize, DataTypes);
  var Teacher = _Teacher(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Schedule.belongsTo(Class, { as: "class", foreignKey: "class_id"});
  Class.hasOne(Schedule, { as: "schedule", foreignKey: "class_id"});
  Student.belongsTo(Class, { as: "class", foreignKey: "class_id"});
  Class.hasMany(Student, { as: "students", foreignKey: "class_id"});
  Schedule.belongsTo(Classroom, { as: "classroom", foreignKey: "classroom_id"});
  Classroom.hasOne(Schedule, { as: "schedule", foreignKey: "classroom_id"});
  Grade.belongsTo(Schedule, { as: "schedule", foreignKey: "schedule_id"});
  Schedule.hasMany(Grade, { as: "grades", foreignKey: "schedule_id"});
  Grade.belongsTo(Student, { as: "student", foreignKey: "student_id"});
  Student.hasMany(Grade, { as: "grades", foreignKey: "student_id"});
  Schedule.belongsTo(Subject, { as: "subject", foreignKey: "subject_id"});
  Subject.hasMany(Schedule, { as: "schedules", foreignKey: "subject_id"});
  Teacher.belongsTo(Subject, { as: "subject", foreignKey: "subject_id"});
  Subject.hasMany(Teacher, { as: "teachers", foreignKey: "subject_id"});
  Schedule.belongsTo(Teacher, { as: "teacher", foreignKey: "teacher_id"});
  Teacher.hasMany(Schedule, { as: "schedules", foreignKey: "teacher_id"});
  Student.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasOne(Student, { as: "student", foreignKey: "user_id"});
  Teacher.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasOne(Teacher, { as: "teacher", foreignKey: "user_id"});

  return {
    Class,
    Classroom,
    Grade,
    Schedule,
    SchoolSetting,
    Student,
    Subject,
    Teacher,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
