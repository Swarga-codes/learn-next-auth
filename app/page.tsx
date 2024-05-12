'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const router=useRouter()
  async function logout(){
    const response=await fetch('/api/auth/logout',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
    })
    const data=await response.json()
    if(data.success){
      toast.success(data.message)
      router.push('/login')
    }
  }
  return (
 <div className="flex flex-col justify-center m-auto">
  <h1 className="text-center text-5xl font-bold font-sans">Welcome, you are authenticated!</h1>
  <button className="px-4 py-2 bg-red-500 hover:bg-red-800 text-white w-fit m-auto mt-10 rounded-lg" onClick={()=>{
    if(window.confirm('Do you really wish to logout?')){
      logout()
    }
   
  }}>Logout</button>
 </div>
   
  );
}
