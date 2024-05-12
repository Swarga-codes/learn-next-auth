import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function POST(req:NextRequest){
    cookies().delete('token');
    return NextResponse.json({success:true,message:'Logged out successfully!'})
}