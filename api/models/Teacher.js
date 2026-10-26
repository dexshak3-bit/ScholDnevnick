const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Teacher', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "teachers_user_id_key"
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subjects',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'teachers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "teachers_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "teachers_user_id_key",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
