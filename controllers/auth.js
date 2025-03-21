const prisma = require ('../config/prisma')
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const { token } = require('morgan')
exports.register = async(req,res)=>{
    try{
        //code
        const {email, password} = req.body
        

        //step 1 Validate body
        if(!email){
            return res.status(400).json({ message : 'Email is require!!!'})
        }
        if(!password){
            return res.status(400).json({message : 'Password is require!!!' })
        }

        //step 2 check email in DB already ?
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(user){
            return res.status(400).json({message: 'Email already exits'})
        }
        //step 3 hashPassword
        const hashPassword = await bcrypt.hash(password,10)

        //step 3.4 register
        await prisma.user.create({
            data:{
                email: email,
                password: hashPassword
            }
        })

        res.send('Register Success')
    }catch(err){
        //err
        console.log('err')
        res.status(500).json({message : 'Server error'})
    }
}
// exports.forgotPassword = async (req,res)=>{
//     try{
//         console.log("มาว่ะ")
//     }catch(err){
//         console.log(err)
//     }
// }
exports.login = async(req,res)=>{
    try{
        //code
        const { email, password } = req.body
        //step 1 Check Email
        const user = await prisma.user.findFirst({
            where:{email: email}
        })
        if(!user || !user.enabled){
            return res.status(400).json({message: 'User not found or not enabled'})
        }
        //step 2 Check Password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:'Password invalid'})
        }
        //step 3 Create Payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        
        //step 4 Generate Token
        jwt.sign(payload,process.env.SECRET,{ expiresIn:'1d'},(err,token)=>{
            if(err){
                return res.status(500).json({message:'Server error'})
            }
            res.json({payload, token})
            
        })
    }catch(err){
        //err
        console.log('err')
        res.status(500).json({message : 'Server error'})
    }
}
exports.currentUser= async(req,res)=>{
    try{
        //code
        const user = await prisma.user.findFirst({
            where:{ email:req.user.email },
            select:{
                id:true,
                email:true,
                name:true,
                role:true
            }
        })
        res.json({user})
    }catch(err){
        //err
        console.log('err')
        res.status(500).json({message : 'Server error'})
    }
}