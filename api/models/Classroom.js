const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Classroom', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    room_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "classrooms_room_number_key"
    }
  }, {
    sequelize,
    tableName: 'classrooms',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "classrooms_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "classrooms_room_number_key",
        unique: true,
        fields: [
          { name: "room_number" },
        ]
      },
    ]
  });
};
