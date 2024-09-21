const express=require('express');
const cookieParser=require('cookie-parser');
const userModel=require('./models/user');
const postModel=require('./models/post');
const path=require('path');
const bcrypt=require('bcrypt');

const jwt=require('jsonwebtoken');


const app=express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs')


app.get("/",(req,res)=>{
    res.render('index')
})

app.post('/create',async (req,res)=>{
    let {name, email, password}= req.body;

    let user= await userModel.findOne({email})
    if (user) return res.send("error");

    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let createduser = await userModel.create({
                name : name,
                email : email,
                
                password: hash
            });
            let token= await jwt.sign({email:email,userid:createduser._id},"shhh")

            res.cookie("token",token);
            res.redirect('/login')
        })
    })
    
    
    
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.post('/login', async (req,res)=>{
    let {email,password}=req.body;
    let user= await userModel.findOne({email});
    console.log(user)
    if (!user) return res.send ("went wrong");
    else
        bcrypt.compare(password,user.password, async (err,result)=>{
            if(result) {
                let allpost= await postModel.find({user:`${user._id}`});
                
                let token= await jwt.sign({email:email,userid:user._id},"shhh")

                res.cookie("token",token);
                return res.render ("show",{user:user,post:allpost})}
            else res.redirect("/login")
        })
    
})
app.get("/logout", (req,res)=>{
    req.cookies("token","");
    res.redirect("/login")
})
app.get("/profile", isloggedin, async (req,res)=>{
    let user= await userModel.findOne({_id:req.user.userid});
    res.render("post",{user:user})
})

app.post("/:id",async (req,res)=>{
    let _id=req.params.id;
    
    let user= await userModel.findOne({_id :_id});
    let createdpost = await postModel.create({
        image:req.body.image,
        user :user._id,
        
    });

    
    await user.post.push(createdpost._id);
    await user.save();
    let allpost= await postModel.find({user:`${_id}`});
    res.render('show',{user:user,post:allpost})
})

function isloggedin(req,res,next,){
    if(req.cookies.token==="") res.redirect("/login");
    else{
        let data=jwt.verify(req.cookies.token,"shhh");
        req.user=data;
        
    }
    next();
}
app.listen(3000)