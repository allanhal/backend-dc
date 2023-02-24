var express = require('express');
var router = express.Router();
var fs = require('fs');
const { join } = require('path');
const { path } = require('../app');


// Listar produtos Lucas e Wesley
router.get('/', function(req, res, next) {
    res.send('Lista de produtos')
});



// Listar produtos por ID Guilherme e Hélio
router.get('/', function(req, res, next) {
    res.send('Lista de produtos')
});



// Criar produtos Deivid e Igor
router.post('/novoproduto', function(req, res, next) {
    fs.readFile('./data/produtos.json',"utf8", (err, data)=>{
        const produtos = json.parse(data)
        
        const maiorId = produtos.reduce((max, obj)=> {
            return obj.id > max ? obj.id : max ;
        }, 0);
        const novoId = parseInt(maiorId) + 1;
        const produtoNovo = {...req.body };

        produtoNovo.id = novoId;
        produtos.push(produtoNovo)
        fs.writeFile('./data/produtos.json', JSON.stringify(produtos))
        res.send(produtoNovo)
    })
});



// Atualizar produtos André e Rian
function update(req, res, next) {
    res.send('Alterar/Update produto ' + req.params.id)
}
router.put('/:id', update);
router.patch('/:id', update);



// Apagar produtos Emmanuel
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
