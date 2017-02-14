var express = require('express');
var router = express.Router();
var CtrlEmpleados = require('../controllers/login.controller');
/* GET users listing. */
router.get('/', CtrlEmpleados.getDataEmpleado);

module.exports = router;
