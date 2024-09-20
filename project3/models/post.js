const mongoose=require('mongoose');



const postSchema=mongoose.Schema({
    // date : {
    //     type:Date,
    //     default :Date.now
    // },
    image : String,
    user:
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    
})
module.exports=mongoose.model('post',postSchema)