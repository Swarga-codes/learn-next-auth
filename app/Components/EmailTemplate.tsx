import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  verifyOtp:number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,verifyOtp
}) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <p>Please verify your account using this given OTP <b>{verifyOtp}</b></p>
    <p>Note: This otp is valid only for an hour. Only verified users will be able to login.</p>
  </div>
);
