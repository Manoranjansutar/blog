import express from 'express'
import { connectDB } from './config/db.js';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import cors from 'cors'
import aws from 'aws-sdk'


//schema
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';


const server = express();
connectDB();
let PORT = 3000;

//setting aws
const s3 = new aws.S3({
   region: 'ap-south-1' ,
//    accessKeyId: process.env.AWS_ACCESS_KEY ,
//    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY

// add the access key and secret access key here removed for security purpose and uploading in github


}) 

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors())

const generateUploadUrl = async () =>{
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
    return await s3.getSignedUrlPromise('putObject',{
        Bucket : 'blogspace-blog',
        Key : imageName,
        Expires : 1000,
        ContentType: "image/jpeg"
    });
}

const verifyJWT = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(token === null){
        return res.status(401).json({error:"No access token"})
    }

    jwt.verify(token,process.env.SECRET_ACCESS_KEY,(err,user)=>{
        if(err){
            return res.status(403).json({error:"Access token is invalid"})
        }

        req.user = user.id;
        next();
    })
}

const formatDataToSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

const generateUsername = async (email) => {
    let username = email.split("@")[0];
    let usernameExists = await User.exists({ "personal_info.username": username }).then((result) => result)
    usernameExists ? username += nanoid().substring(0, 5) : "";
    return username;
}

//upload image url  route
server.get('/get-upload-url',(req,res)=>{
    generateUploadUrl().then(url=>res.status(200).json({uploadURL:url}))
    .catch(err =>{
        console.log(err.message);
        return res.status(500).json({"error": err.message})
    })
})


server.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;
    //validating data from frontend
    if (fullname.length < 3) {
        return  res.status(403).json({ "error": "Fullname must be greater than 3" })
    }

    if (!email.length) {
        return res.status(200).json({ "error": "Please enter email" })
    }

    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Invalid email" })
    }

    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a numeric , 1 lowercase and 1 uppercase letters" })
    }



    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUsername(email);
        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        });

        user.save().then((u) => {
            return res.status(200).json(formatDataToSend(u))
        })
            .catch(err => {
                if (err.code === 11000) {
                    return res.status(500).json({ "error": "Email already exists" })
                }
                return res.status(500).json({ "error": err.message })
            })
    })

})

server.post("/signin", (req, res) => {
    let { email, password } = req.body;
    User.findOne({ "personal_info.email": email })
        .then((user) => {
            if (!user) {
                return res.status(403).json({ "error": "email not found" })
            }

            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json("error", "Error occured while login please try again")
                }
                if (!result) {
                    return res.status(403).json({ "error": "Incorrect password" })
                } else {
                    return res.status(200).json(formatDataToSend(user))
                }
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ "error": err.message })
        })
})

//google auth====> to do

//latest blog
server.get('/latest-blog',(req,res)=>{
    const maxLimit = 5;

    Blog.find({draft:false})
    .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt":-1})
    .select("blog_id title des banner activity tags publishedAt -_id")
    .limit(maxLimit)
    .then(blogs =>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
})

//trending blog

server.get('/trending-blog',(req,res)=>{
    const maxLimit = 5;

    Blog.find({draft:false})
    .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"activity.total_read":-1,"activity:total_likes":-1,"publishedAt":-1})
    .select("blog_id title publishedAt -_id")
    .limit(maxLimit)
    .then(blogs =>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
})

//search blog
server.post('/search-blogs',(req,res)=>{
    let {tag} = req.body;
    let findQuery = {tags:tag, draft:false}
    const maxLimit = 5;

    Blog.find(findQuery)
    .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt":-1})
    .select("blog_id title des banner activity tags publishedAt -_id")
    .limit(maxLimit)
    .then(blogs =>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
})


//create blog
server.post('/create-blog' , verifyJWT, (req,res)=>{
    let authorId = req.user;
    let { title,des,banner,tags,content,draft} = req.body;

    
    if(!title.length){
        return res.status(403).json({error:"You must provide a title to publish the blog"})
    }
    
    if(!draft){
        if(!des.length || des.length>200){
            return res.status(403).json({error:"You must provide blog description under 200 characters"})
        }
    
        if(!banner.length){
            return res.status(403).json({error:"You must provide a blog banner to publish the blog"})
        }
    
        if(!content.blocks.length){
            return res.status(403).json({error:"There must be some blog content to publish the blog"})
        }
    
        if(!tags.length || tags.length>10){
            return res.status(403).json({error:"Provide tags in order to publish the blog, Maximum 10 tags"})
        }
    }


    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = title.replace(/[^a-zA-Z0-9]/g,' ').replace(/\s+/g,'-').trim() + nanoid();

    let blog = new Blog({
        title,des,banner,author:authorId,content,tags,draft:Boolean(draft),blog_id
    })

    blog.save().then(blog =>{
        let incrementalVal = draft ? 0 :1;
        User.findOneAndUpdate({_id:authorId},{$inc:{"account_info.total_posts":incrementalVal,$push:{"blogs":blog._id}}})
    }).then(user=>{
        return res.status(200).json({id:blog.blog_id})
    }).catch(err=>{
        return res.status(500).json({error:"Failed to update total number of posts"})
    })
})




server.listen(PORT, () => {
    console.log("port is running ->" + PORT)
})
