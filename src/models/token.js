const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    token:{type:String,require:true}
},{versionKey:false,strict:true,strictQuery:false})

module.exports = mongoose.model('Token',tokenSchema)
