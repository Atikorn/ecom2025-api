const express = require('express')
const prisma = require('../config/prisma')
const router = express.Router()
const cloudinary = require ('cloudinary').v2


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


exports.create = async(req,res)=>{
    try{
        //code
        const { title,description,price,quantity,images,categoryId,modelsId} = req.body
        //console.log(title,description,price,quantity,images)
        const product = await prisma.product.create({
            data:{
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                modelsId: parseInt(modelsId),
                images:{
                    create: images.map((item)=> ({
                        asset_id:item.asset_id,
                        public_id:item.public_id,
                        url      :item.url,
                        secure_url :item.secure_url
                    }))
                }
            }
        })

        res.send(product)
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}
exports.list = async(req,res)=>{
    try{
        const { count } = req.params
        const products = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: {createdAt : "desc"}, //เรียงลำดับตาม ID มากไปน้อย
            include:{  //include เป็นการ Join ตาราง
                category:true,
                images:true
            } 
        })
        res.send(products)
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}
exports.read = async(req,res)=>{
    try{
        const { id } = req.params
        const products = await prisma.product.findFirst({
            where:{
                id:Number(id)
            },
            include:{  //include เป็นการ Join ตาราง
                category:true,
                images:true
            } 
        })
        res.send(products)
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}
exports.update = async(req,res)=>{
    try{
        //code
        const { title,description,price,quantity,images,categoryId,modelsId} = req.body
        //console.log(title,description,price,quantity,images)

        // clear images
        await prisma.image.deleteMany({
            where:{
                productId: Number(req.params.id)
            }
        })

        const product = await prisma.product.update({
            where:{
                id:Number(req.params.id)
            },
            data:{
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                modelsId:parseInt(modelsId),
                images:{
                    create: images.map((item)=> ({
                        asset_id:item.asset_id,
                        public_id:item.public_id,
                        url      :item.url,
                        secure_url :item.secure_url
                    }))
                }
            }
        })

        res.send(product)
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}
exports.remove = async(req,res)=>{
    try{
        //code
        const { id } = req.params

        //หนังชีวิตแน่นอน
        //step 1 ค้นหาสินค้า include images

        const product = await prisma.product.findFirst({
            where: { id: Number(id) },
            include: { images:true }
        })
        if(!product){
            return res.status(400).json({message : 'Product not found!'})
        }
        //console.log(product)
        //step 2 Promise ลบรูปภาพใน cloud รอฉันด้วย
        const deletedImage =  product.images.map((image)=>
        new Promise((resolve,reject)=>{
            //ลบจาก cloud
            cloudinary.uploader.destroy(image.public_id,(error,result)=>{
            if(error){
                reject(error)
            } else{
                resolve(result)
            }
            })
        })
        )
        await Promise.all(deletedImage)

        //step 3 ลบสินค้า
        await prisma.product.delete({
            where:{
                id: Number(id)
            }
        })
        res.send('Delete Success')
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}
exports.listby = async(req,res)=>{
    try{
        //code
        const{ sort,order,limit } = req.body
        // console.log(sort,order,limit)
        const products = await prisma.product.findMany({
            take: limit,
            orderBy:{ [sort]:order },
            include:{ category:true,images:true }
        })
        res.send(products)
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}
const handleQuery = async(req,res,query)=>{
    try{
        //code
        const products = await prisma.product.findMany({
            where:{
                title:{
                    contains: query,
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Search error"})
    }
}
const handlePrice = async(req,res,priceRange)=>{
    try{
        //code
        const products = await prisma.product.findMany({
            where:{
                price:{
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Search error"})
    }
}
const handleCategory = async(req,res,categoryId)=>{
    try{
        //code
        const products = await prisma.product.findMany({
            where:{
                categoryId:{
                    in: categoryId.map((id)=> Number(id))
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Search error"})
    }
}
exports.searchFiltersProducts = async(req,res)=>{
    try{
        //code
        const{ query, category, price } = req.body

        if(query){
            console.log('query-->',query)
            await handleQuery(req,res,query)
        }
        if(category){
            console.log('category-->',category)
            await handleCategory(req,res,category)
        }
        if(price){
            console.log('price-->',price)
            await handlePrice(req,res,price)
        }
        //res.send('hello searchFilters product')
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}
const handleModel = async (req, res, modelsId) => {
    try {
        //code
        const products = await prisma.product.findMany({
            where: {
                modelsId: {
                    in: modelsId.map((id) => Number(id)) // loop ModelsId for seaching
                }
            },
            include: {
                category: true,
                images: true,
                models: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
exports.searchModels = async (req, res) => {
    try {
        //code
        const { models } = req.body
        if (models) {
            console.log('models-->', models)
            await handleModel(req, res, models)
        }
        // res.send('hello searchFilters product')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })

    }
}
exports.getModelsByCategory = async (req, res) => { 
    try {
        const { categoryId } = req.params;
        const models = await prisma.model.findMany({
            where: { categoryId: Number(categoryId) }
        });
        res.send(models);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}; //Latest Edited
exports.getProductsByModel = async (req, res) => {
    try {
        const { modelId } = req.params;
        const products = await prisma.product.findMany({
            where: { modelsId: Number(modelId) },
            include: { models: true, category: true, images: true }
        });
        res.send(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}; //Latest Edited


exports.createImages = async (req,res) => {
    try{
        //console.log(req.body)
        const result = await cloudinary.uploader.upload(req.body.image,{
            public_id: `Atikorn-${Date.now()}`,
            resource_type: 'auto',
            folder: 'Ecom2025'
        })
        res.send(result)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server E\error"})
    }
}
exports.removeImage = async (req,res) => {
    try{
        const { public_id } = req.body
        //console.log(public_id)
        cloudinary.uploader.destroy(public_id,(result)=>{
            res.send('Remove imgae success')
        })

        
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server error"})
    }
}