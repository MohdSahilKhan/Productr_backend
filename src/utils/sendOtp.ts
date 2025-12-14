import nodemailer from "nodemailer";
import twilio from "twilio";

const isEmail = (input: string) => /\S+@\S+\.\S+/.test(input);
const isPhone = (input: string) => /^[0-9]{10}$/.test(input);

const createEmailTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  if (!smtpUser || !smtpPassword) {
    throw new Error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD environment variables.");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });
};
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }
  
  return twilio(accountSid, authToken);
};

export const sendOtp = async (identifier: string, otp: string) => {
  try {
    const identifierStr = String(identifier).trim();
    
    if (isEmail(identifierStr)) {
      const transporter = createEmailTransporter();
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: identifierStr,
        subject: "Your OTP for Login",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">OTP for Login</h2>
            <p>Your One-Time Password (OTP) for login is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This OTP is valid for 5 minutes. Please do not share this OTP with anyone.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to email: ${identifierStr}`);
    } else if (isPhone(identifierStr)) {
      const client = getTwilioClient();
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
      if (!twilioPhoneNumber) {
        throw new Error("Twilio phone number not configured");
      }
      let formattedPhone = String(identifierStr).trim();
      if (!formattedPhone.startsWith("+")) {
        const countryCode = process.env.DEFAULT_COUNTRY_CODE || "1";
        formattedPhone = `+${countryCode}${formattedPhone}`;
      }
      await client.messages.create({
        body: `Your OTP for login is: ${otp}. This OTP is valid for 5 minutes.`,
        from: twilioPhoneNumber,
        to: formattedPhone,
      });
      console.log(`OTP sent to phone: ${formattedPhone}`);
    } else {
      throw new Error("Invalid identifier format");
    }
  } catch (error: any) {
    console.error("Error sending OTP:", error.message);
    throw error;
  }
};
