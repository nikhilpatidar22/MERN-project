
const mongoose=require('mongoose');

mongoose.connect("mongodb+srv://nikhil22:10452003@cluster0.7e0eb2w.mongodb.net/project3");

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