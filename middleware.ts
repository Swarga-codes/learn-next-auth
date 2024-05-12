import { NextRequest, NextResponse } from "next/server";
export function middleware(request:NextRequest){
   let path=request.nextUrl.pathname
   let token=request.cookies.get('token')?.value
   let publicRoutes=path==='/login' || path==='/register'
   if(!token && !publicRoutes) return NextResponse.redirect(new URL('/login',request.nextUrl))
   if(token && publicRoutes) return NextResponse.redirect(new URL('/',request.nextUrl))

}

export const config={
    matcher:['/','/login','/register','/verifyOtp']
}