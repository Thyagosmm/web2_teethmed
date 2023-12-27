const Sequelize = require("sequelize");
const sequelize = new Sequelize("teethmed", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});
const Usuario = sequelize.define("usuario", {
  login: {
    type: Sequelize.STRING(15),
  },
  nome: {
    type: Sequelize.STRING(50),
  },
  senha: {
    type: Sequelize.STRING(255),
  },
  perfil: {
    type: Sequelize.STRING(50),
  },
});
Usuario.sync()
  .then(() => {
    console.log("Tabela de usuário criada!");
  })
  .catch((erro) => {
    console.log("Erro ao criar a tabela de usuário: " + erro);
  });
module.exports = Usuario;
