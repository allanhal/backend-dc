var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/', function (req, res, next) {
    res.send("Exibe todos os carrinhos")
});

router.get('/:id', function (req, res, next) {
    res.send("Exibe apenas um carrinho")
});

router.post('/', function(req, res, next) {
    res.send('Criar novo carrinho')
});

router.patch('/:id', function(req, res, next) {
    res.send('edita um carrinho')
});


router.delete('/:id', function(req, res, next) {
    res.send('deleta um carrinho')
});




module.exports = router;