var express = require('express');
var router = express.Router();
var fs = require('fs');
const { path } = require('../app');


// Listar produtos Lucas e Wesley
router.get('/', function (req, res, next) {
    fs.readFile('./data/produtos.json', "utf8", (err, data) => {

        res.send(data)
    })
});



// Listar produtos por ID Guilherme e Hélio
router.get('/:id', function (req, res, next) {
    fs.readFile('./data/produtos.json', "utf8", (err, data) => {
        const produtos = JSON.parse(data)
        const id = req.params.id

        const produtoProcurado = produtos.find((produto) => produto.id === id)

        res.send(produtoProcurado)
    })
});



// Criar produtos Deivid e Igor
router.post('/', function (req, res, next) {
    fs.readFile('./data/produtos.json', "utf8", (err, data) => { 
        const produtos = JSON.parse(data)
        
        const maiorId = produtos.reduce((max, obj) => {
            return obj.id > max ? obj.id : max;
        }, 0);
        const novoId = parseInt(maiorId) + 1;
        const produtoNovo = {...req.body };

        produtoNovo.id = novoId;
        produtos.push(produtoNovo)
        fs.writeFileSync('./data/produtos.json', JSON.stringify(produtos))

        res.send(produtoNovo)
    })
});



// Atualizar produtos André e Rian
function update(req, res, next) {
    fs.readFile('./data/produtos.json', "utf8", (err, data) => { //Lê o arquivo
        const produtos = JSON.parse(data)
        const id = req.params.id //Esse id é no id que eu quero alterar

        const produtoRequisitado = produtos.find((produto) => produto.id === id)
        const produtoAlterado = { ...produtoRequisitado, ...req.body };
        produtos[id-1] = produtoAlterado

        fs.writeFileSync('./data/produtos.json', JSON.stringify(produtos))

        res.send(produtoAlterado)
    })
}
router.put('/:id', update);
router.patch('/:id', update);



// Apagar produtos Emmanuel
router.delete('/:id', function (req, res, next) {
    fs.readFile('./data/produtos.json', "utf8", (err, data) => {
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
