var express = require("express");
var router = express.Router();
var fs = require("fs");
const jwt = require("jsonwebtoken");

const db = require("../db");

router.get("/", async function (req, res, next) {
  try {
    const userSearched = await db.sequelize.models.usuario.findAll();
    res.status(200).send(userSearched);
  } catch {
    res.status(404).send({
      erro: "arquivo não encontrado",
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      res.status(400).send("Dados incompletos para login");
      return;
    }
    const usuarioEncontrado = await db.sequelize.models.usuario.findOne({
      where: { username, password },
    });

    if (usuarioEncontrado) {
      const { id } = usuarioEncontrado;
      const token = jwt.sign({ id }, process.env.JWT_SECRET);
      res.send(token);
      return;
    } else {
      res.status(400).send("usuário não encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("JSON inválido");
  }
});

router.get("/profile", async function (req, res, next) {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      res.status(401);
      return res.send({ auth: false, message: "Token não fornecido" });
    }
    const token = auth.split(" ")[1];
    const result = await jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await db.sequelize.models.usuario.findOne({
      where: { id: result.id },
    });
    res.send(usuario);
  } catch (error) {
    console.error(err);
    res.status(400).send(error);
  }

  //   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  // 	if (err) {
  // 	  res.status(500);
  // 	  res.send({ auth: false, message: "Falha na autenticação" });
  // 	}
  // 	req.user = decoded; // retornando o usuario vindo do token
  // 	console.log(decoded);
  // 	next();
  //   });
});

router.get("/find/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const usuarioSelecionado = await db.sequelize.models.usuario.findOne({
      where: { id },
    });
    if (usuarioSelecionado) {
      res.send(usuarioSelecionado);
    } else {
      res.send("Nenhum usuario encontrado para esse id");
    }
  } catch {
    res.send("Ocorreu um  erro:" + err);
  }
});

// Função para atualizar dados de usuário. PUT e PATCH mesmo resultado apos testes, por isso associei a função "update" aos dois métodos.
async function update(req, res, next) {
  const { id: userId } = req.params;
  const { id, ...rest } = req.body;
  const bichoUpdatado = await db.sequelize.models.usuario.update(rest, {
    where: {
      id: userId,
    },
  });
  res.send(bichoUpdatado);
}

router.put("/:id", update);
router.patch("/:id", update);

router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const carrinhoEncontrado = await db.sequelize.models.carrinho.findOne({
      where: { usuarioId: id },
    });
    if (carrinhoEncontrado) {
      await db.sequelize.models.carrinhoProduto.destroy({
        where: { carrinhoId: carrinhoEncontrado.id },
      });
      await db.sequelize.models.carrinho.destroy({ where: { usuarioId: id } });
    }

    const usuariodeletado = await db.sequelize.models.usuario.destroy({
      where: { id },
    });
    if (usuariodeletado) {
      res.send("deletado");
    } else {
      res.send("Nenhum usuario encontrado para esse id");
    }
  } catch (err) {
    res.send("Ocorreu um  erro:" + err);
  }
});

module.exports = router;
