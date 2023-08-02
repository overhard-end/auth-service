const nodemailer = require("nodemailer");
const User = require("../models/user");
const Token = require("../utils/token");



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
      html:`<div>
      <h1>${link}</h1>
      <a href="${link}">Verify now</a>
      </div>`
    })
    return true
  } catch (error) {
    console.log(error);
    return false
  }
};

class EmailService{
  createAndSendToken = async (userId,email)=>{
  const token =  Token.createEmailVerifyToken(userId)
  const link = new URL(`${process.env.BASE_URL}/api/verify/`)
  link.searchParams.append('token',token)
  return await sendEmail(email,link)
  }
async verifyEmail(token){
  const isVerified = Token.verifyEmailToken(token)
  console.log(isVerified)
  if(!isVerified) return false
  const user = await User.findOneAndUpdate({_id:isVerified.userId},{verified:true})
  console.log('verifyEmail',user)
  if(!user) return false
  return true
}
}
module.exports = new EmailService;