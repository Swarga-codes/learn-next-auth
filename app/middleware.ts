import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from 'jsonwebtoken'
export async function middleware(req:NextRequest){
    
    return NextResponse.next()
}

export const config={
    matcher:['/api/auth/verifyOtp','/api/sample']
}