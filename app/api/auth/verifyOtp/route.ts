import USER from "@/app/models/userSchema";
import connectDb from "@/app/util/connectDb";
import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from 'jsonwebtoken'
export async function PUT(req:NextRequest){
    try{
const {otp,email}=await req.json()
await connectDb();
if(!otp || !email) return NextResponse.json({success:false,message:'One or more fields are missing!'},{status:422})
const existingUser=await USER.findOne({email:email})
if(!existingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})
if(existingUser.isVerified) return NextResponse.json({success:false,message:'User is already verified, please login!'},{status:409})
//whether the otp is same or not

if(existingUser.verifyOtp!==otp) return NextResponse.json({success:false,message:'Otp did not match, try again!'}) 
const currentTime:Date=new Date()
const expiryTime:Date=new Date(existingUser.verifyOtpExpiry)
const timeDifference:number=Math.ceil((currentTime-expiryTime)/(1000*60*60))
if(timeDifference>1) return NextResponse.json({success:false,message:'Otp has expired please register again to generate another OTP!'},{status:403})
existingUser.isVerified=true
await existingUser.save();
const response=NextResponse.json({success:true,message:'User verified successfully!',email:existingUser.email,username:existingUser.username},{status:200})
const token=jsonwebtoken.sign({email:existingUser.email,username:existingUser.username},process.env.SECRET_KEY)
response.cookies.set('token',token)
return response
    }
    catch(err){
        console.log(err)
        return NextResponse.json({success:false,message:'Internal Server error'},{status:500})
    }
}