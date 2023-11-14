const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static("public"));

app.get("/inicio", (req, res) => {
  res.send(
    "<h1>Você está na página inicial da clínica odontológica TeethMed!</h1>"
  );
});

app.post("/formulario", urlencodedParser, (req, res) => {
  let htmlResponse = "<h1>Dados Recebidos</h1><table>";
  for (let key in req.body) {
    htmlResponse += `<tr><td>${key}: </td><td>${req.body[key]}</td></tr>`;
  }
  htmlResponse += "</table>";
  res.send(htmlResponse);
});

app.listen(port, () => {
  console.log(`Este servidor está escutando a porta ${port}`);
});
