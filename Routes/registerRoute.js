const express = require('express') 
const router = express.Router()
const registerController = require('../Controllers/registerController')

router.get('/',registerController.index);
router.post('/submit',registerController.register);

module.exports = router