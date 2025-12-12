import { Request, Response } from "express";
import User from "../models/User";
import { sendOtp } from "../utils/sendOtp";

const isEmail = (input: string) => /\S+@\S+\.\S+/.test(input);
const isPhone = (input: string) => /^[0-9]{10}$/.test(input);

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body;
    if (!identifier)
      return res.status(400).json({ success: false, message: "Identifier is required" });

    const isEmailAddress = isEmail(identifier);
    const isPhoneNumber = isPhone(identifier);
    if (!isEmailAddress && !isPhoneNumber) {
      return res.status(400).json({ success: false, message: "Invalid email or phone" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    let user = await User.findOne({
      $or: [
        { email: isEmailAddress ? identifier : null },
        { phone: isPhoneNumber ? identifier : null }
      ]
    });
    if (!user) {
      user = await User.create({
        email: isEmailAddress ? identifier : undefined,
        phone: isPhoneNumber ? identifier : undefined
      });
    }
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
    await sendOtp(identifier, otp);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err: any) {
    console.error("Request OTP Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp)
      return res.status(400).json({ success: false, message: "Identifier & OTP required" });

    const isEmailAddress = isEmail(identifier);
    const isPhoneNumber = isPhone(identifier);
    const user = await User.findOne({
      $or: [
        { email: isEmailAddress ? identifier : null },
        { phone: isPhoneNumber ? identifier : null }
      ]
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
      return res.status(400).json({ success: false, message: "OTP expired" });
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    return res.json({
      success: true,
      message: "OTP verified successfully",
      user
    });
  } catch (err: any) {
    console.error("Verify OTP Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  console.log("Body received at /resend-otp:", req.body);

  try {
    const { identifier } = req.body;
    if (!identifier)
      return res.status(400).json({ success: false, message: "Identifier is required" });
    const isEmailAddress = isEmail(identifier);
    const isPhoneNumber = isPhone(identifier);
    if (!isEmailAddress && !isPhoneNumber)
      return res.status(400).json({ success: false, message: "Invalid email or phone" });
    const user = await User.findOne({
      $or: [
        { email: isEmailAddress ? identifier : null },
        { phone: isPhoneNumber ? identifier : null }
      ]
    });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
    await sendOtp(identifier, otp);
    return res.status(200).json({
      success: true,
      message: "OTP resent successfully"
    });
  } catch (err: any) {
    console.error("Resend OTP Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
