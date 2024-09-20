
const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/project3");

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    age:Number,
    password : String,
    post:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:'post'

        }
    ]
})
module.exports=mongoose.model('user',userSchema)