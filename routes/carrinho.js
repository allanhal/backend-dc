var express = require('express');
var router = express.Router();
var fs = require('fs');
const { path } = require('../app');

// Listar carrinhos de compras por ID de usuário
router.get('/:id', function (req, res, next) {
  const usuarioId = req.params.id;
  fs.readFile('./data/carrinhos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao ler carrinhos de compras');
      return;
    }

    const carrinhos = JSON.parse(data);
    const carrinhoDoUsuario = carrinhos[usuarioId] || {};

    res.send(carrinhoDoUsuario);
  });
});

// Adicionar item ao carrinho de compras
router.post('/:id', function (req, res, next) {
  const usuarioId = req.params.id;
  fs.readFile('./data/carrinhos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao ler carrinhos de compras');
      return;
    }

    const carrinhos = JSON.parse(data);
    const carrinhoDoUsuario = carrinhos[usuarioId] || {}; // usando o id do usuario eu busco o carrinho ou retorno ele vazio
    

    const itemId = req.body.itemId;
    const quantidade = req.body.quantidade;

    carrinhoDoUsuario[itemId] = (carrinhoDoUsuario[itemId] || 0) + quantidade;
    carrinhos[usuarioId] = carrinhoDoUsuario;

    fs.writeFile('./data/carrinhos.json', JSON.stringify(carrinhos), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar carrinho de compras');
        return;
      }

      res.send(carrinhoDoUsuario);
    });
  });
});

// Atualizar item do carrinho de compras
router.put('/:id/:itemId', function (req, res, next) {
  const usuarioId = req.params.id;
  const itemId = req.params.itemId;
  const quantidade = req.body.quantidade;

  fs.readFile('./data/carrinhos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao ler carrinhos de compras');
      return;
    }

    const carrinhos = JSON.parse(data);
    const carrinhoDoUsuario = carrinhos[usuarioId] || {};

    carrinhoDoUsuario[itemId] = quantidade;
    carrinhos[usuarioId] = carrinhoDoUsuario;

    fs.writeFile('./data/carrinhos.json', JSON.stringify(carrinhos), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar carrinho de compras');
        return;
      }

      res.send(carrinhoDoUsuario);
    });
  });
});
// Remover item do carrinho de compras
router.delete('/:id/:itemId', function (req, res, next) {
  const usuarioId = req.params.id;
  const itemId = req.params.itemId;

  fs.readFile('./data/carrinhos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao ler carrinhos de compras');
      return;
    }

    const carrinhos = JSON.parse(data);
    const carrinhoDoUsuario = carrinhos[usuarioId] || {};

    if (carrinhoDoUsuario.hasOwnProperty(itemId)) {
      delete carrinhoDoUsuario[itemId];
    } else {
      res.status(404).send('Item não encontrado no carrinho de compras');
      return;
    }

    carrinhos[usuarioId] = carrinhoDoUsuario;

    fs.writeFile('./data/carrinhos.json', JSON.stringify(carrinhos), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar carrinho de compras');
        return;
      }

      res.send(carrinhoDoUsuario);
    });
  });
});

