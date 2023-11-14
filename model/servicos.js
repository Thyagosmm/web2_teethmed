const Sequelize = require("sequelize");
const sequelize = new Sequelize("teethmed", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});
sequelize
  .authenticate()
  .then(function () {
    console.log("Conectado!!");
  })
  .catch(function (erro) {
    console.log("Erro ao conectar: " + erro);
  });
