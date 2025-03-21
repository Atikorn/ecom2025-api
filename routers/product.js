const express = require('express')
const router = express.Router()
const { create,list,read,update,remove,listby,searchFiltersProducts,createImages,removeImage,getModelsByCategory,getProductsByModel } = require ('../controllers/product')
const { authCheck,adminCheck } = require('../middlewares/authCheck')
//@ENDPOINT http://localhost:5000/api/product
router.post('/product',create)
router.get('/products/:count',list)
router.get('/product/:id',read)
router.put('/product/:id',update)
router.delete('/product/:id',remove)
router.post('/productby',listby)
router.post('/search/filters',searchFiltersProducts)

router.post('/images',authCheck,adminCheck,createImages)
router.post('/removeimages',authCheck,adminCheck,removeImage)

router.get("/models/:categoryId", getModelsByCategory); // Latest Edited
router.get("/products/model/:modelId", getProductsByModel); // Latest Edited


module.exports = router