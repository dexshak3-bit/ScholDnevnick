const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SchoolSetting', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    curr_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'school_settings',
    timestamps: false,
    indexes: [
      {
        name: "school_settings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
