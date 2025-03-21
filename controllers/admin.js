const prisma = require("../config/prisma")

exports.chandOrderStatus = async(req,res)=>{
    try{
        const{ orderId, orderStatus } = req.body
        //console.log(orderId, orderStatus)
        const orderUpdate = await prisma.order.update({
            where:{ id: orderId},
            data:{ orderStatus: orderStatus }
        })

        res.json(orderUpdate)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}
// const handleQueryEmail = async(req,res,query)=>{
//     try{
//         //code
//         const email = await prisma.user.findMany({
//             where:{
//                 email:{
//                     contains: query,
//                 }
//             },
//         })
//         res.send(email)
//     }catch(err){
//         //err
//         console.log(err)
//         res.status(500).json({message : "Search Error"})
//     }
// }
// exports.searchFiltersEmail = async(req,res)=>{
//     try{
//         const {query} = req.body

//         if(query){
//             console.log('query--',query)
//             await handleQueryEmail(req,res,query)
//         }
//     }catch(err){
//         console.log(err)
//         res.status(500).json({message:"Search error"})
//     }
// }
exports.getOrderAdmin = async(req,res)=>{
    try{
        const orders = await prisma.order.findMany({
            include:{
                products:{
                    include:{
                        product:true
                    }
                },
                orderedBy:{
                    select:{
                        id:true,
                        email:true,
                        address:true
                    }
                },address:true
            }
        })
        res.json(orders)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}