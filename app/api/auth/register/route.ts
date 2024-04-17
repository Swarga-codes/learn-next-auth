import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export async function POST(req:NextRequest){
const {username,email,password}=await req.json()
const passwordRegex=/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/
const mySchema=z.object({
    username:z.string().min(4, {message:'Must be 4 characters or long!'}),
    email:z.string().email({message:'Must be an email!'}),
    password:z.string().min(8,{message:'Must be atleast 8 characters long!'}).regex(passwordRegex,{message:'Password should have atleast one lowercase, uppercase, number and special characters!'})
})
const validation=mySchema.safeParse({username,email,password})
if(!validation.success){
return NextResponse.json(validation,{status:422})
}
return NextResponse.json({message:'User registered successfully'},{status:200})
}