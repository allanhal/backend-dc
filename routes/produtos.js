var express = require('express');
var router = express.Router();
var fs = require('fs');

const db = require('../db');
const { Op } = require('sequelize');

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration 
cloudinary.config({
    cloud_name: "drbuwibae",
    api_key: "574653997659613",
    api_secret: process.env.CLOUDNARY_SECRET
});

console.log('process.env.CLOUDNARY_SECRET', process.env.CLOUDNARY_SECRET)

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads' // Define o diretório no Cloudinary para armazenar os uploads
    }
});

const upload = multer({ storage: storage });

//ROTA BUSCANDO TODOS OS PRODUTOS DO ARQUIVO LIDO COM O MODULO FS
router.get('/', async function (req, res, next) {
    try {
        const userSearched = await db.sequelize.models.produto.findAll()
        res.status(200).send(userSearched)
    } catch {
        res.status(404).send({
            "erro": "arquivo não encontrado"
        })
    }
});
//Rota para busca por palavra-chave
router.get('/search', async function (req, res, next) {
    const { palavra_chave } = req.query
    try {
        const userSearched = await db.sequelize.models.produto.findAll({
            where: {
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${palavra_chave}%`,
                        }
                    },
                    {
                        categoria: {
                            [Op.iLike]: `%${palavra_chave}%`,
                        }
                    },
                ]
            }
        })
        res.status(200).send(userSearched)
    } catch (err) {
        console.error(err)
        res.status(404).send({
            "erro": "arquivo não encontrado"
        })
    }
})
//--------------------------------------
//Rota para buscar um produto individualmente 
router.get('/:id', function (req, res, next) {
    fs.readFile('./data/produtos.json', "utf-8", (err, data) => {
        const { id } = req.params

        try {
            const produtos = JSON.parse(data)

            const produtoSelecionado = produtos.find((produto) => produto.id === id)
            if (produtoSelecionado) {
                res.send(produtoSelecionado)
            } else {
                res.send("Nenhum produto encontrado para essa especificação")
            }
        }
        catch {
            res.send('Ocorreu um erro:' + err)
        }


    })

});

//Rota para adicionar um produto
router.post('/', async function (req, res, next) {
    const { categoria,
        titulo,
        descricao,
        valor,
        desconto,
        img, } = req.body
    try {
        if (!categoria || !titulo || !descricao || !valor) {
            res.status(400).send('Dados incompletos para criação de novo usuário');
            return;
        }
        const produtoCriado = await db.sequelize.models.produto.create(
            {
                categoria,
                titulo,
                descricao,
                valor,
                desconto,
                img,
            }
        )
        res.send(produtoCriado)
    } catch (err) {
        console.error(err);
        res.status(400).send('JSON inválido');
    }
});


// function para atualizar um produto existente. Pode usar a mesma função tanto para PUT quanto para PATCH, sendo a diferença no corpo da request.
async function update(req, res, next) {
    const { id: produtoId } = req.params
    const { id, ...rest } = req.body
    const bichoUpdatado = await db.sequelize.models.produto.update(rest, {
        where: {
            id: produtoId
        }
    })
    res.send(bichoUpdatado)
}

router.put('/:id', update);
router.patch('/:id', update);
router.delete('/:id', async function (req, res, next) {
    const { id } = req.params
    try {
        await db.sequelize.models.carrinhoProduto.destroy({ where: { produtoId: id } })

        const produtoDeletado = await db.sequelize.models.produto.destroy({ where: { id } })
        if (produtoDeletado) {
            res.send("deletado")
        } else {
            res.send("Nenhum usuario encontrado para esse id")
        }
    }
    catch (err) {
        res.send('Ocorreu um  erro:' + err)
    }
});

router.post("/imagem/:id", upload.single('imagem'), async (req, res) => {
    try {
        // Verifica se um arquivo foi enviado
        if (!req.file) {
            return res.status(400).send('Nenhum arquivo foi enviado.');
        }
        // Acessa os detalhes do arquivo enviado
        const file = req.file;
        // Obtém a URL pública do arquivo no Cloudinary
        const imageUrl = file.path;

        const bichoUpdatado = await db.sequelize.models.produto.update({ img: imageUrl }, {
            where: {
                id: req.params.id
            }
        })
        res.send(bichoUpdatado)
    } catch (error) {

        res.send(error);
    }

    // const { id, img } = req.body;
    // try {
    //     if (!id || !img) {
    //         res.status(400).send("Dados incompletos");
    //         return;
    //     }

    // } catch (err) {
    //     console.error(err);
    //     res.status(400).send(err);
    // }
});


module.exports = router;
