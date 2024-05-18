import USER from "@/app/models/userSchema";
import connectDb from "@/app/util/connectDb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
export async function POST(req:NextRequest){
try {
    const {email,password}=await req.json()
    await connectDb()
    if(!email || !password) return NextResponse.json({success:false, message:'One or more fields are missing'},{status:422})
    const existingUser=await USER.findOne({email:email})
    if(!existingUser) return NextResponse.json({success:false,message:'User doesnt exist with the given email'},{status:404})
    const isPasswordMatching=await bcrypt.compare(password,existingUser.password)
    if(!isPasswordMatching) return NextResponse.json({success:false,message:'Passwords do not match'},{status:403})
        if(!existingUser.isVerified) return NextResponse.json({success:false,message:'User is not verified, please verify to login!'},{status:403})
    const token=await jsonwebtoken.sign({email,username:existingUser.username},process.env.SECRET_KEY || "",{expiresIn:'1h'})
    const response=NextResponse.json({success:true,message:'Logged in successfully!',email,username:existingUser.username},{status:200})
    response.cookies.set('token',token)
    return response
} catch (error) {
    console.log(error)
    return NextResponse.json({success:false,message:'Internal Server Error'},{status:500})
}
} 