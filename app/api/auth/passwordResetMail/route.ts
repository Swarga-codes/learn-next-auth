import USER from "@/app/models/userSchema";
import connectDb from "@/app/util/connectDb";
import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/app/util/sendEmailConfig";
export async function PUT(req:NextRequest){
    try{
    
    connectDb();
    const {email}=await req.json()
    if(!email) return NextResponse.json({success:false,message:'Email cannot be empty!'},{status:422})
    const isExistingUser=await USER.findOne({email:email})
    if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})
    const verifyOtp=Math.floor(100000+Math.random()*900000);
    isExistingUser.verifyOtp=verifyOtp
    isExistingUser.verifyOtpExpiry=new Date(Date.now()+36000000)
    await isExistingUser.save();
    const info = await transporter.sendMail({
        from: '<myapp@gmail.com>', 
        to: email, 
        subject: "My Auth App || Reset Password",
        
        html: `<p>Reset your password using this OTP </p> <b>${verifyOtp}</b>
        <p>Note: This OTP is valid only for an hour!</p>
        `, 
      });
      return NextResponse.json({success:true,message:'Mail sent, please check your inbox for the OTP!'})
    }
    catch(err){
        console.log(err)
        return NextResponse.json({success:false,message:'Could not send mail'},{status:500})
    }
}