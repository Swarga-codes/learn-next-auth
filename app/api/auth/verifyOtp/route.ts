import USER from "@/app/models/userSchema";
import connectDb from "@/app/util/connectDb";
import { NextRequest, NextResponse } from "next/server";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";

export async function PUT(req: NextRequest) {
  try {
    const decodedToken = checkValidityOfToken(req);
    if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });

    const email = decodedToken?.email;
    const { otp } = await req.json();

    await connectDb();

    if (!otp || !email) {
      return NextResponse.json({ success: false, message: 'One or more fields are missing!' }, { status: 422 });
    }

    const existingUser = await USER.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ success: false, message: 'User not found!' }, { status: 404 });
    }

    if (existingUser.isVerified) {
      return NextResponse.json({ success: false, message: 'User is already verified, please login!' }, { status: 409 });
    }

    // whether the otp is same or not
    if (existingUser.verifyOtp !== otp) {
      return NextResponse.json({ success: false, message: 'Otp did not match, try again!' });
    }

    const currentTime: Date = new Date();
    const expiryTime: Date = new Date(existingUser.verifyOtpExpiry);

    // Calculate the time difference in hours
    const timeDifference: number = Math.ceil((currentTime.getTime() - expiryTime.getTime()) / (1000 * 60 * 60));
    
    if (timeDifference > 1) {
      return NextResponse.json({ success: false, message: 'Otp has expired, please register again to generate another OTP!' }, { status: 403 });
    }

    existingUser.isVerified = true;
    await existingUser.save();

    return NextResponse.json({ success: true, message: 'User verified successfully!', email: existingUser.email, username: existingUser.username }, { status: 200 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: 'Internal Server error' }, { status: 500 });
  }
}
