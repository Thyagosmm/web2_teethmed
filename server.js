const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static("public"));
const Paciente = require("./model/my_db");

app.get("/inicio", (req, res) => {
  res.send(
    "<h1>Você está na página inicial da clínica odontológica TeethMed!</h1>"
  );
});

app.post("/agendamentoservico", urlencodedParser, (req, res) => {
  let htmlResponse = "<h1>Comprovante de Agendamento</h1><table>";
  for (let key in req.body) {
    htmlResponse += `<tr><td>${key}: </td><td>${req.body[key]}</td></tr>`;
  }
  htmlResponse += "</table>";
  res.send(htmlResponse);
});

app.post("/cadastropaciente", urlencodedParser, (req, res) => {
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

app.listen(port, () => {
  console.log(`Este servidor está escutando a porta ${port}`);
});
