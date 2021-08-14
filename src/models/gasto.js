const Sequelize = require("sequelize");
const database = require("../database");

const Gasto = database.define(
    "gasto", {
  idgasto: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  descricao: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  },
  valor: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
},
{
  freezeTableName: true
});

module.exports = Gasto
