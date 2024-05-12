import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import { NextRequest, NextResponse } from "next/server";

export function GET(req:NextRequest){
    const decodedToken=checkValidityOfToken(req)
    if(!decodedToken.success) return NextResponse.json(decodedToken,{status:401})
    return NextResponse.json({message:'Im on!'},{status:200})
}