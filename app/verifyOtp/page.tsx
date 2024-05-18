'use client'
import React, { useRef, useState, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>(Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>()));

  // State to store the OTP entered by the user
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

  const focusNextInput = (index: number): void => {
    if (index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].current?.focus();
    }
  };

  const focusPrevInput = (index: number): void => {
    if (index > 0) {
      inputRefs.current[index - 1].current?.focus();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, index: number): void => {
    const { value } = event.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      focusNextInput(index);
    } else if (value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (event.key === 'Backspace') {
      if (otp[index] === '') {
        focusPrevInput(index);
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async(): Promise<void> => {
    const otpString = otp.join('');
    const response = await fetch('/api/auth/verifyOtp', {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        otp: Number(otpString)
      })
    });

    const data = await response.json();
    if(data.success){
      toast.success(data.message);
      router.push('/');
    } else {
      toast.error(data.message);
    }
    console.log(data);
  };

  return (
    <div className="max-w-md mx-auto border mt-20 rounded-lg p-10">
      <h2 className="text-center text-2xl font-bold leading-tight text-white mb-4">
        Verify OTP
      </h2>
      <p className='text-white text-center'>Please check for the OTP in your registered email</p>
      <form className="shadow-md px-4 py-6" onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleVerify();
      }}>
        <div className="flex justify-center gap-2 mb-6">
          {inputRefs.current.map((inputRef, index) => (
            <input
              key={index}
              ref={inputRef}
              className="w-12 h-12 text-center text-black border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
              type="text"
              // maxLength="1"
              pattern="[0-9]"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={otp[index]}
              onChange={(event) => handleInputChange(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
          ))}
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Verify
          </button>
        </div>
       
      </form>
    </div>
  );
}

export default Page;
