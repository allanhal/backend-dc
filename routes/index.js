var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Servidor DripStore V1');
});

module.exports = router;
