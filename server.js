const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static("public"));
const Paciente = require("./model/my_db");

app.set("view engine", "ejs");
app.set("views", "./views");

app.post("/agendamentoservico", urlencodedParser, (req, res) => {
  let htmlResponse = "<h1>Comprovante de Agendamento</h1><table>";
  for (let key in req.body) {
    htmlResponse += `<tr><td>${key}: </td><td>${req.body[key]}</td></tr>`;
  }
  htmlResponse += "</table>";
  res.send(htmlResponse);
});

app.post("/cadastrarpaciente", urlencodedParser, (req, res) => {
  var nomePaciente = req.body.nome;
  var idadePaciente = req.body.idade;
  var cpfPaciente = req.body.cpf;

  var paciente = Paciente.create({
    nome: nomePaciente,
    idade: idadePaciente,
    cpf: cpfPaciente,
  })
    .then(function () {
      res.send("Paciente cadastrado com sucesso!");
    })
    .catch(function (erro) {
      res.send("Erro ao cadastrar o paciente: " + erro);
    });
});

app.post("/buscarpaciente", urlencodedParser, (req, res) => {
  var nomePaciente = req.body.nome;
  var idadePaciente = req.body.idade;
  var cpfPaciente = req.body.cpf;

  Paciente.findOne({
    where: { nome: nomePaciente, idade: idadePaciente, cpf: cpfPaciente },
  })
    .then(function (paciente) {
      if (paciente) {
        res.render("resultadobusca", { paciente: paciente });
      } else {
        res.send("Paciente não encontrado");
      }
    })
    .catch(function (erro) {
      res.send("Erro ao buscar o paciente: " + erro);
    });
});
app.get("/alterarpaciente", (req, res) => {
  var cpfPaciente = req.query.cpf;

  Paciente.findOne({ where: { cpf: cpfPaciente } })
    .then(function (paciente) {
      if (paciente) {
        res.render("alterar", { paciente: paciente });
      } else {
        res.send("Paciente não encontrado");
      }
    })
    .catch(function (erro) {
      res.send("Erro ao buscar o paciente: " + erro);
    });
});
app.post("/alterarpaciente", urlencodedParser, (req, res) => {
  var nomePaciente = req.body.nome;
  var idadePaciente = req.body.idade;
  var cpfPaciente = req.body.cpf;

  Paciente.update(
    { nome: nomePaciente, idade: idadePaciente },
    { where: { cpf: cpfPaciente } }
  )
    .then(function ([rowsUpdate]) {
      if (rowsUpdate === 0) {
        res.send("Paciente não encontrado");
      } else {
        res.send("Dados do paciente atualizados com sucesso!");
      }
    })
    .catch(function (erro) {
      res.send("Erro ao atualizar os dados do paciente: " + erro);
    });
});
app.get("/excluirpaciente", (req, res) => {
  var cpfPaciente = req.query.cpf;

  Paciente.destroy({
    where: {
      cpf: cpfPaciente,
    },
  })
    .then(function () {
      res.send("Paciente excluído com sucesso!");
    })
    .catch(function (erro) {
      console.log("Erro na exclusão: " + erro);
      res.send("Erro na exclusão" + erro);
    });
});

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/busca", (req, res) => {
  res.render("busca");
});
app.get("/cadastro", (req, res) => {
  res.render("cadastro");
});

app.listen(port, () => {
  console.log(`Este servidor está escutando a porta ${port}`);
});
