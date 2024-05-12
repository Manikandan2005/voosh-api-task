import bcrypt from "bcrypt"
import prisma from "../lib/PrismaClient.js"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()

const login = async(req,res)=>{
    try{
    const {username,password} = req.body

    //filter the user using username from database
    const user = await prisma.user.findUnique({where:{username},})
    
    //Check if the user exists
    if(!user)
    {
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

       const validation = await bcrypt.compare(password,user.password)   //use bcrypt compare to check hashed pswd and body pswd

       //Check whether the password is correct
       if(!validation)
       {
        return res.status(401).json({
            message:"Invalid Credentials"
        })
       }

       
        const age = 1000*60*60
         //create token using JWT
        const token = jwt.sign(
            {
                id: user.id,      //payload
                isAdmin: true,
            },
            process.env.JWT_SECRETKEY,  //secretkey
            {expiresIn:age}   //expiry time
        );

        const {password:Userpassword,...userInfo} = user
        return res.cookie("token",token,{
            httpOnly:true,
            maxAge:age,
        }).status(200)
        .json(userInfo)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


//Log out the user

const logout = (req,res)=>{
    res.clearCookie("token").status(200).json({message:"Logout Successfull"})
}


// register the user

const signup = async(req,res)=>{
    try{
        const {email,username,password} = req.body

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = await prisma.user.create({
        data:{
            username,
            email,
            password:hashedPassword,
        },
    });

    res.status(200).json({
        message:"User created successfully"
    })
    }
    catch(error){
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
};




export default{
    login,
    logout,
    signup,
}