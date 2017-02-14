var express = require('express');
var router = express.Router();
var server = require("http").Server(express());
var io = require('socket.io')(server);


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('admin', { title: 'Express' });
});



module.exports = router;
