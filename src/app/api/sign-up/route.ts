import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/user.model";
import bcrypt from "bcrypt";
import { sendVerficationEmail } from "@/src/helper/sendVerficationEmail";
import { success } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifyByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifyByUsername) {
      return (
        Response.json({
          success: false,
          message: "Username already exists",
        }),
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
        if(existingUserByEmail.isVerified){
            return Response.json({
                success: false,
                message: "Email already registered and verified",
            }, { status: 400 });
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now
            await existingUserByEmail.save();
        }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour from now

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerficationEmail(email, username, verifyCode);
    if (!emailResponse.success){
        return Response.json({
            success: false,
            message: emailResponse.message,
        }, { status: 500 });
    }

    return Response.json({
        success: true,
        message: "User Registered Successfully. Verification email sent.",
    }, { status: 201 });

  } catch (error) {
    console.error("Error in sign-up route:", error);
    return Response.json(
      {
        success: false,
        message: "Error Registering User",
      },
      { status: 500 }
    );
  }
}
