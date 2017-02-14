var express = require('express');
var router = express.Router();
var CtrlLogin = require('../controllers/login.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user_id){
      res.redirect('/home');
  }
  let error_message = req.flash('error')[0];
  res.render('index', { title: 'Express', error: error_message });
});

router.get('/salir/', CtrlLogin.logaut);

module.exports = router;
