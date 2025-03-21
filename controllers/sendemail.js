const nodemailer = require('nodemailer');
const prisma = require('../config/prisma');
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const { token } = require('morgan')

require('dotenv').config();

exports.sendemail = async(req,res) =>{

    const {email} =req.body

    const user = await prisma.user.findFirst({
        where:{
            email: email
        }
    })

    if (!user) {
        return res.status(400).json({message: 'Email not found please register'})
    }
    // console.log(email)

    const token = jwt.sign({email},process.env.JWT_SECRET_KEY,{
        expiresIn:"1h"})


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    const option = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Password Reset</title>
        </head>
        <body style="background-color: #f3f4f6; padding: 40px; font-family: Arial, sans-serif;">
            <div style="max-width: 400px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: auto;">
                <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                <p style="color: #555; text-align: center;">
                    We received a request to reset your password. Click the button below to set a new password:
                </p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="http://localhost:5173/ChangForGotPassword/${token}"
                       style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
                    If you did not request a password reset, please ignore this email.
                </p>
                <p style="color: #777; font-size: 12px; text-align: center;">
                    Thank you,<br>
                    <strong>AP Ecommerce</strong>
                </p>
                <div style="background-color: #e5e7eb; padding: 10px; text-align: center; font-size: 10px; color: #666; border-radius: 5px; margin-top: 20px;">
                    This is an automated message, please do not reply.
                </div>
            </div>
        </body>
        </html>
        `
    };
    
    

    transporter.sendMail(option,(err,info) =>{
        if(err) {
            console.log('err',err)
            return res.status(200).json({
                RespCode: 400,
                RespMessage:'bad',
                RespError: err
            })
        }else{
            console.log('send: '+info.response)
            return res.status(200).json({
                RespCode: 200,
                RespMessage:'good',
                RespError: err
            })
        }
        // try({
            
        // }catch(err){
        //     console.log(err)
        // }
    })
}
exports.resetPassword = async (req,res) => {
    try {
        const {password} = req.body;
        const {token} = req.params; 

        if(!token){
            return res.status(400).json({message:"No token"})
        }

        if(!password){
            return res.status(400).json({message:"Please fill password"})
        }
        
        //ถอดรหัส Token
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)

        const email = decode.email;
        
        //ตรวจสอบว่ามี User จริงหรือไม่
        const user = await prisma.user.findFirst({
            where: {email: email}
        })

        if(!user) {
            return res.status(400).json({message:"User not found"})
        }

        // hash รหัสผ่านใหม่
        const newhashPassword = await bcrypt.hash(password,10)

        //step save new password
        await prisma.user.update({
            where: {email: email},
            data: {password: newhashPassword}
        })
        
        res.status(200).json({message:"Chang password successfully"})
    } catch (error) {
        return res.status(500).json({message:'Error',error})
    }
}