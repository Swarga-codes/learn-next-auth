'use client'
import React, { useRef } from 'react';

function Page() {
  const inputRefs = Array.from({ length: 6 }, () => useRef(null));

  const focusNextInput = index => {
    if (index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    // Assuming you want to automatically move to the next input when a digit is entered
    if (value.length === 1) {
      focusNextInput(index);
    }
  };

  return (
    <div className="max-w-md mx-auto border mt-20 rounded-lg p-10">
      <h2 className="text-center text-2xl font-bold leading-tight text-white mb-4">
        Verify OTP
      </h2>
      <p className='text-white text-center'>Please check for the OTP in your registered email</p>
      <form className="shadow-md px-4 py-6">
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
              onChange={event => handleInputChange(event, index)}
            />
          ))}
        </div>
        <div className="flex items-center justify-center">
          <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Verify
          </button>
          <a className="inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800 ml-4" href="#">
            Resend OTP
          </a>
        </div>
      </form>
    </div>
  );
}

export default Page;
