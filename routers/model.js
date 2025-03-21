const express = require('express')
const router = express.Router()
const { authCheck, adminCheck } = require('../middlewares/authCheck')
const { createM, listM, removeM } = require('../controllers/model')

//ENDPOINT model http://localhost:5001/api/category
router.post('/createModel', authCheck, adminCheck, createM)
router.get('/listModel', listM)
router.delete('/model/:id', authCheck, adminCheck, removeM)







module.exports = router