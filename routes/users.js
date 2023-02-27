var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/', function (req, res, next) {
    fs.readFile('./data/users.json', "utf-8", (err, data) => {
        try {
            const userSearched = JSON.parse(data)
            res.status(200).send(userSearched)
        } catch{
            res.status(404).send({
                "erro":"arquivo não encontrado"
            })
        }
    })  
});

router.get('/:id', function (req, res, next) {
    res.send("Exibe apenas um users")
});

router.post('/', function(req, res, next) {
    res.send('Criar novo usuario')
});

router.patch('/:id', function(req, res, next) {
    res.send('edita um usuario')
});


router.delete('/:id', function(req, res, next) {
    res.send('deleta um usuario')
});




module.exports = router;