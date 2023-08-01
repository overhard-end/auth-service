const nodemailer = require("nodemailer");
const TokenModel = require('../models/token');
const  Uuid = require('uuid');
const User = require("../models/user");



const sendEmail = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host:'smtp-relay.brevo.com',
      port:587,
      secure: false, 
      auth:{
        user:'magomeg134@gmail.com',
        pass:'Mpg7CJYc6bPZ9x5a'
    }
    });

    await transporter.sendMail({
      from: 'coolCloud@gmail.com',
      to: email,
      subject: 'Verify coolCloud email',
      text: 'For confirm yor email, please press on the link',
      html:`<a href="${link}">Verify now</a>`
    })
    return true
  } catch (error) {
    console.log(error);
    return false
  }
};

class EmailService{
  createAndSendToken = async (userId,email)=>{
  const token = await TokenModel.create({userId:userId,token:Uuid.v4()},)
  if(!token) return false
   const link = new URL(`${process.env.BASE_URL}/api/verify/`)
    link.searchParams.append('id',userId)
    link.searchParams.append('token',token.token)
  return await sendEmail(email,link)
  }
async verifyEmail(userId,token){
  const user = await User.findOne({_id:userId})
  if(!user) return false
  const tokenFromBD = await TokenModel.findOne({token:token})
  if(!tokenFromBD)return false
  if(!tokenFromBD.token === token) return false
  await User.updateOne({ _id:userId}, { $set: { verified: true } })
  await TokenModel.deleteOne({token:token})
  
  return true
}
}
module.exports = new EmailService;