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
      from: 'magomet266@gmail.com',
      to: email,
      subject: 'verify coolCloud email',
      text: 'for confirm yor email, please press on the link',
      html:`<a href="${link}">Verify now</a>`
    });
  } catch (error) {
    console.log(error);
  }
};

class EmailService{
  createEmailToken = async (userId)=>{
   return await TokenModel.create({userId:userId,token:Uuid.v4()})
  }
 async sendVerifyEmail(email,token,userId){
    const link = new URL(`${process.env.BASE_URL}/api/verify/`)
    link.searchParams.append('id',userId)
    link.searchParams.append('token',token)
  await  sendEmail(email,link)
   return true 
  }
async verifyEmail(userId,token){
  console.log(userId)
  const user = await User.findOne({_id:userId})
 
  if(!user) return false
  const tokenFromBD =  await TokenModel.findOne({userId:user._id})
  if(tokenFromBD.token === token){
    console.log(tokenFromBD.token)
   await User.updateOne({ _id:userId}, { $set: { verified: true } })
   await TokenModel.deleteOne({token:token})
    return true
  } 
return false

}
}
module.exports = new EmailService;