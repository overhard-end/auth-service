const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    createdAt:{type:Date,expires:120,default:Date.now()},
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    token:{type:String,require:true}
},{versionKey:false,strict:true,strictQuery:false,timestamps:true})

module.exports = mongoose.model('Token',tokenSchema)
