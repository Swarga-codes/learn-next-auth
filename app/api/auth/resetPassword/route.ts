import USER from "@/app/models/userSchema";
import connectDb from "@/app/util/connectDb";
import { NextRequest, NextResponse } from "next/server";
import {z} from 'zod'
import bcrypt from 'bcrypt'
export async function PUT(req:NextRequest){
    try{
    const {email,otp,password}=await req.json()
    if(!email || !otp || !password) return NextResponse.json({success:false,message:'One or more fields are missing!'},{status:422})
    connectDb()
    const isExistingUser=await USER.findOne({email})
    if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})
    if(isExistingUser.verifyOtp!==otp) return NextResponse.json({success:false,message:'OTP do not match!'},{status:403})
    const currentTime:Date=new Date()
    const expiryTime:Date=new Date(isExistingUser.verifyOtpExpiry)
    const timeDifference:number=Math.ceil((currentTime.getTime()-expiryTime.getTime())/(1000*60*60))
    if(timeDifference>1) return NextResponse.json({success:false,message:'Otp has expired please resend mail again to generate another OTP!'},{status:403})
        const passwordRegex=/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/
    const mySchema=z.object({
        password:z.string().min(8,{message:'Must be atleast 8 characters long!'}).regex(passwordRegex,{message:'Password should have atleast one lowercase, uppercase, number and special characters!'})
    })
    const validation=mySchema.safeParse({password})
    if(!validation.success){
    return NextResponse.json({success:false,validation},{status:422})
    }
    const isExistingPassword=await bcrypt.compare(password,isExistingUser.password)
    if(isExistingPassword) return NextResponse.json({success:false,message:'New password cannot be same as current password!'},{status:409})
    const hashedPassword=await bcrypt.hash(password,10)
    isExistingUser.password=hashedPassword
    await isExistingUser.save()
    return NextResponse.json({success:true,message:'Password Updated Successfully!'},{status:200})
}
catch(err){
    console.log(err)
    return NextResponse.json({success:false,message:'Could not update password'},{status:500})
}
}