  'use client'
  import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
  function Page() {
    const router=useRouter()
    const inputRefs = Array.from({ length: 6 }, () => useRef(null));
    // State to store the OTP entered by the user
    const [otp, setOtp] = useState('');

    const focusNextInput = index => {
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    };

    const handleInputChange = (event, index) => {
      const { value } = event.target;
      // Check if the input value is empty
      if (value === '') {
        // If the input value is empty, erase the previous digit from the OTP state
        setOtp(prevOtp => prevOtp.slice(0, -1));
      } else if (value.length === 1) {
        // If a digit is entered, move to the next input and update the OTP state
        focusNextInput(index);
        setOtp(prevOtp => prevOtp + value);
      }
    };
    

    const handleVerify = async() => {
      const response=await fetch('/api/auth/verifyOtp',{
        method:'PUT', 
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          otp:Number(otp)
        })
      })
      const data=await response.json()
      if(data.success){
        toast.success(data.message)
        router.push('/')
      }
      else{
        toast.error(data.message)
      }
      console.log(data);
      
    };

    return (
      <div className="max-w-md mx-auto border mt-20 rounded-lg p-10">
        <h2 className="text-center text-2xl font-bold leading-tight text-white mb-4">
          Verify OTP
        </h2>
        <p className='text-white text-center'>Please check for the OTP in your registered email</p>
        <form className="shadow-md px-4 py-6" onSubmit={(e)=>{
          e.preventDefault()
          handleVerify()
        }}>
          <div className="flex justify-center gap-2 mb-6">
            {inputRefs.map((inputRef, index) => (
              <input
                key={index}
                ref={inputRef}
                className="w-12 h-12 text-center text-black border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                type="text"
                maxLength="1"
                pattern="[0-9]"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={otp[index] || ''}
                onChange={event => handleInputChange(event, index)}
              />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={handleVerify} // Call handleVerify function on button click
            >
              Verify
            </button>
            <button className="inline-block align-baseline border-2 border-teal-500 py-2 px-4 rounded font-bold text-sm text-teal-500 hover:text-teal-800 ml-4" href="#">
              Resend OTP
            </button>
            
          
          </div>
          <button
              className="bg-red-500 hover:bg-red-700 mt-4 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="reset"
              onClick={()=>setOtp('')}
            >
              Reset
            </button>
        </form>
      </div>
    );
  }

  export default Page;
