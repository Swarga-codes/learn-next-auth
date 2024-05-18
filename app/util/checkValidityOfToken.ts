import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from 'jsonwebtoken'
export const checkValidityOfToken = (req:NextRequest)=>{
    try{
    let token= req.cookies.get('token')?.value || ""
   
    if(!token) return {success:false,message:'Unauthorized,token not found!'}
    let decodeToken:any=jsonwebtoken.verify(token,process.env.SECRET_KEY || "")
    if(!decodeToken) return {success:false,message:'Token expired, try logging in again!'}
    return {success:true, email:decodeToken?.email}
    }
catch(err:any){
    console.log("Error:  ",err)
    return {success:false,message:'Unauthorized'}
}
}