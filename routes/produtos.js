var express = require('express');
var router = express.Router();
var fs = require('fs');
const { path } = require('../app');

router.get('/', function(req, res, next) {
    res.send('Lista de produtos')
});
router.post('/', function(req, res, next) {
    res.send('Criar produto')
});
function update(req, res, next) {
    res.send('Alterar/Update produto ' + req.params.id)
}
router.put('/:id', update);
router.patch('/:id', update);
router.delete('/:id', function(req, res, next) {
    fs.readFile('./data/produtos.json',"utf8", (err, data) => {
        const produtos = JSON.parse(data)
        const id = req.params.id

        const produtoDeletado = produtos.find((produto) => produto.id === id)
        const novosProdutos = produtos.filter((produto) => produto.id !== id)

        fs.writeFileSync('./data/produtos.json', JSON.stringify(novosProdutos))

        res.send(produtoDeletado)
    })
    // res.send('Remove produto ' + req.params.id)
});


module.exports = router;
