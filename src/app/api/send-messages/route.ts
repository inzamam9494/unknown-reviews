import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/user.model";
import {Message} from '@/src/models/user.model'
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect();

    const {username, content }= await request.json();
    try {
        const user = await UserModel.findOne({username});
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        // Check if user is accepting messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success : false,
                    message: "User is not accepting messages",
                },{ status: 403 }
            )
        }
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully",
        },{ status: 200 });
    } catch (error) {
        console.log("Error adding messages", error);
        return Response.json({
            success: false,
            message: "Internal server Erroor",
        }, { status: 500 } ); 
    }
}
