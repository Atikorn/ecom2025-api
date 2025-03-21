//import ...
const express = require('express')
const router = express.Router()
const { authCheck} = require('../middlewares/authCheck')
//import controller
const{ getOrderAdmin,chandOrderStatus,searchFiltersEmail } = require('../controllers/admin')

// router.post('/admin/search/filters',authCheck,searchFiltersEmail)
router.put('/admin/order-status',authCheck,chandOrderStatus)
router.get('/admin/orders',authCheck,getOrderAdmin)


module.exports = router