const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static("public"));
const Paciente = require("./model/my_db");

app.set("view engine", "ejs");
app.set("views", "./views");

const Usuario = require("./model/user_db");
const uuid = require("uuid");
const session = require("express-session");
const bcrypt = require("bcrypt");
app.use(
  session({
    secret: "2C44-1T58-WFpQ350",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000 * 2,
    },
  })
);

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

app.get("/", function (req, res) {
  res.render("home", { session: req.session, message: req.query.message });
});

app.get("/busca", (req, res) => {
  res.render("busca");
});
app.get("/cadastro", (req, res) => {
  res.render("cadastro");
});
app.get("/cadastrarusuario", verificaAutenticacao, (req, res) => {
  res.render("cadastrarusuario");
});

app.post("/cadastrar_usuario", urlencodedParser, async (req, res) => {
  var login = req.body.login;
  var nome = req.body.nome;
  var senha = req.body.senha;
  var perfil = req.body.perfil;

  var senhaCriptografada = await bcrypt.hash(senha, 10);

  Usuario.create({
    login: login,
    nome: nome,
    senha: senhaCriptografada,
    perfil: perfil,
  })
    .then(function (usuario) {
      res.redirect("/");
    })
    .catch(function (erro) {
      res.send("Erro ao cadastrar usuário: " + erro);
    });
});
app.get("/buscarusuario", (req, res) => {
  res.render("buscarusuario");
});
app.post("/buscar_usuario", urlencodedParser, (req, res) => {
  var loginUsuario = req.body.login;

  Usuario.findOne({
    where: { login: loginUsuario },
  })
    .then(function (usuario) {
      if (usuario) {
        res.render("resultadobuscausuario", { usuario: usuario });
      } else {
        res.send("Usuário não encontrado");
      }
    })
    .catch(function (erro) {
      res.send("Erro ao buscar o usuário: " + erro);
    });
});
app.post("/alterar_usuario", urlencodedParser, (req, res) => {
  var loginUsuario = req.body.login;
  var nomeUsuario = req.body.nome;
  var perfilUsuario = req.body.perfil;

  Usuario.update(
    { nome: nomeUsuario, perfil: perfilUsuario },
    { where: { login: loginUsuario } }
  )
    .then(function ([rowsUpdate]) {
      if (rowsUpdate === 0) {
        res.send("Usuário não encontrado");
      } else {
        res.redirect("/?message=Dados do usuário atualizados com sucesso!");
      }
    })
    .catch(function (erro) {
      res.send("Erro ao atualizar os dados do usuário: " + erro);
    });
});
app.get("/alterarusuario", verificaAutenticacao, (req, res) => {
  var loginUsuario = req.query.login;

  Usuario.findOne({ where: { login: loginUsuario } })
    .then(function (usuario) {
      if (usuario) {
        res.render("alterarusuario", { usuario: usuario });
      } else {
        res.send(
          '<script>alert("Usuário não encontrado"); window.location.href="/login";</script>'
        );
      }
    })
    .catch(function (erro) {
      res.send(
        '<script>alert("Você precisa buscar pelo usuário que deseja alterar os dados."); window.location.href="/buscarusuario";</script>'
      );
    });
});

app.get("/excluirusuario", verificaAutenticacao, (req, res) => {
  var loginUsuario = req.query.login;

  Usuario.destroy({
    where: {
      login: loginUsuario,
    },
  })
    .then(function () {
      res.redirect("/?message=Usuário excluído com sucesso!");
    })
    .catch(function (erro) {
      res.send(
        '<script>alert("Você precisa buscar pelo usuário que deseja excluir os dados."); window.location.href="/buscarusuario";</script>'
      );
    });
});
app.get("/login", function (req, res) {
  res.render("login", { message: req.query.message });
});
app.post("/login", urlencodedParser, async (req, res) => {
  var login = req.body.login;
  var senha = req.body.senha;
  Usuario.findOne({
    where: {
      login: login,
    },
  })
    .then(async function (usuario) {
      if (usuario != null) {
        const senha_valida = await bcrypt.compare(senha, usuario.senha);
        if (senha_valida) {
          req.session.userid = usuario.id;
          req.session.name = usuario.nome;
          req.session.login = usuario.login;
          res.redirect("/");
        } else {
          res.redirect("/login?message=Login ou senha estão incorretos!");
        }
      } else {
        res.redirect("/login?message=Login ou senha estão incorretos!");
      }
    })
    .catch(function (erro) {
      res.send("Erro ao realizar login: " + erro);
    });
});
function verificaAutenticacao(req, res, next) {
  if (req.session && req.session.userid) {
    next();
  } else {
    res.send(
      '<script>alert("Você precisa estar logado para acessar esta página."); window.location.href="/login";</script>'
    );
  }
}

app.listen(port, () => {
  console.log(`Este servidor está escutando a porta ${port}`);
});
