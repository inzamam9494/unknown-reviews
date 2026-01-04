import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/user.model";
import bcrypt from "bcrypt";
import { sendVerficationEmail } from "@/src/helper/sendVerficationEmail";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username, email, password} = await request.json()
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