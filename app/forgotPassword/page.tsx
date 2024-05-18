'use client'
import React, { useState } from 'react'
import { ArrowRight,KeyRound } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
export default function Page() {
  const router=useRouter()
  const [email,setEmail]=useState('')
  const [otp,setOtp]=useState('')
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [isLoading,setIsLoading]=useState(false)
async function sendMail(){
const response=await fetch('/api/auth/passwordResetMail',{
    method:'PUT',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify({
        email
    })
})
const data=await response.json()
if(data.success){
    toast.success(data.message)
}
else{
    toast.error(data.message)
}
 }
async function updatePassword(){
const response=await fetch('/api/auth/resetPassword',{
    method:'PUT',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify({
        email,
        otp:Number(otp),
        password:password
    })
})
const data=await response.json()
if(data.success){
    toast.success(data.message)
    router.push('/login')
}
else if(data.error){
    toast.error(data.error.issues.map((issue:any)=>issue.message).join(' '))
}
else{
    toast.error(data.message)
}
}
  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center">
          <KeyRound className='h-12 w-16'/>
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-white">
           Forgot Password
          </h2>
          
          <form className="mt-8" onSubmit={(e)=>{
            e.preventDefault()
            setIsLoading(true)
            if(confirmPassword!==password){
                toast.error('Confirm Password and password should match!')
                return
            }
            updatePassword()
            setIsLoading(false)
          }}>
            <div className="space-y-5">
              <div>
                <label htmlFor="" className="text-base font-medium text-white">
                  {' '}
                  Email address{' '}
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>{
                        setEmail(e.target.value)
                    }}
                    
                  ></input>
                </div>
                <button type='button' className='bg-white text-black px-4 py-2 rounded-md mt-4' onClick={()=>sendMail()}>Send Email</button>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-white">
                    {' '}
                    OTP(Received through email){' '}
                  </label>
                 
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    placeholder="Enter the OTP"
                    value={otp}
                    onChange={(e)=>setOtp(e.target.value)}
                  ></input>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-white">
                    {' '}
                    Password{' '}
                  </label>
                 
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  ></input>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-white">
                    {' '}
                    Confirm Password{' '}
                  </label>
                 
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                  ></input>
                </div>
              </div>
              <div>
              {!isLoading?
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-white px-3.5 py-2.5 font-semibold leading-7 text-black"
                >
                  Verify Otp <ArrowRight className="ml-2" size={16} />
                </button>
                
            :
            <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-md bg-white px-3.5 py-2.5 font-semibold leading-7 text-black"
          >
           Verifying... <ArrowRight className="ml-2" size={16} />
          </button>
            }
                
    
              </div>
            </div>
          </form>
         
        </div>
      </div>
    </section>
  )
}
