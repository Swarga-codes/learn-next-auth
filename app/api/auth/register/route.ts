import USER from "@/app/models/userSchema";
import * as React from 'react'
import connectDb from "@/app/util/connectDb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from 'bcrypt';
import { transporter } from "@/app/util/sendEmailConfig";
import { EmailTemplate } from "@/app/Components/EmailTemplate";


export async function POST(req:NextRequest){
    try{
        await connectDb();
const {username,email,password}=await req.json()
const passwordRegex=/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/
const mySchema=z.object({
    username:z.string().min(4, {success:false,message:'Must be 4 characters or long!'}),
    email:z.string().email({success:false,message:'Must be an email!'}),
    password:z.string().min(8,{success:false,message:'Must be atleast 8 characters long!'}).regex(passwordRegex,{success:false,message:'Password should have atleast one lowercase, uppercase, number and special characters!'})
})
const validation=mySchema.safeParse({username,email,password})
if(!validation.success){
return NextResponse.json(validation,{status:422})
}



/*
 
if existing user then
check whether or not the user is verified or not
if user verified
then cannot use this username
else 
can use this username

 
*/

const isExistingUser= await USER.findOne({email})
const hashPassword=await bcrypt.hash(password,10);
const verifyOtp=Math.floor(100000+Math.random()*900000);
const mailContent=`
<h1>Welcome, ${username}!</h1>
<p>Please verify your account using this given OTP <b>${verifyOtp}</b></p>
<p>Note: This otp is valid only for an hour. Only verified users will be able to login.</p>
`
if(isExistingUser){
    if(isExistingUser.isVerified){
        return NextResponse.json({success:false,message:'User with the following details already exists!'},{status:409})
    }
    else{
        isExistingUser.username=username
        isExistingUser.password=hashPassword
        isExistingUser.verifyOtp=verifyOtp
        isExistingUser.verifyOtpExpiry=new Date(Date.now()+36000000)
        await isExistingUser.save();
       
        const info = await transporter.sendMail({
            from: '<myapp@gmail.com>', 
            to: [email], 
            subject: "My Auth App || Verify Email",
            
            html: `<p>Please verify your account using this OTP </p> <b>${verifyOtp}</b>
            <p>Note: This OTP is valid only for an hour!</p>
            `, 
          });
        return NextResponse.json({success:true,message:'User registered successfully, please verify the email!'},{status:200})
    }
}
const newUser=new USER({
    username,
    email,
    password,
    verifyOtp,
    verifyOtpExpiry:new Date(Date.now()+36000000),
})

await newUser.save();

const info = await transporter.sendMail({
    from: '<myapp@gmail.com>', 
    to: [email],
    subject: "My Auth App || Verify Email",
    
    html: `<p>Please verify your account using this OTP </p> <b>${verifyOtp}</b>
    <p>Note: This OTP is valid only for an hour!</p>
    `, 
  });
return NextResponse.json({success:true,message:'User registered successfully, please verify the email'},{status:200})
    }
    catch(err){
        console.log(err);
        
        return NextResponse.json({success:false,message:'Could not register user, try again!'},{status:500})
    }
}