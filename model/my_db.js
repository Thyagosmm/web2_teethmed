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

const Paciente = sequelize.define("pacientes", {
  nome: {
    type: Sequelize.STRING,
  },
  idade: {
    type: Sequelize.INTEGER,
  },
  cpf: {
    type: Sequelize.STRING,
  },
});

Paciente.sync()
  .then(() => {
    console.log("Tabela criada com sucesso!");
  })
  .catch((erro) => {
    console.log("Erro ao criar a tabela: " + erro);
  });

module.exports = Paciente;
