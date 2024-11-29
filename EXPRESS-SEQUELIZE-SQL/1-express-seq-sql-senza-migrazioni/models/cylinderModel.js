// const { DataTypes } = require("sequelize");
// const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Cylinder = sequelize.define("cylinder", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    // position: {
    //   type: DataTypes.ARRAY(DataTypes.INTEGER),
    //   allowNull: true,
    // },
    radiusTop: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    radiusBottom: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    radialSegments: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    heightSegments: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Cylinder;
};
