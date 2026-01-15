import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";
import { success } from "zod";

export async function GET() {
    await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user?._id);
  try {
    const user = await UserModel.aggregate([
        {$match: {id: userId}},
        {$unwind: '$messages'},
        {$sort: {'messages.createdAt': -1} },
        {$group: {_id: '$_id', messages : {$push: '$messages'}}},
    ])
    if (!user || user.length === 0) {
        return Response.json(
            {
                success: false,
                message: "User not found",
            },{ status: 404 }
        )
    } 
    return Response.json(
        {
            success: true,
            messages: user[0].messages,
        }, { status: 200 }
    )

  } catch (error) {
     console.log("An Unexpected error occured: ", error);
        
        return Response.json({
            success: false,
            message: "Error is sending message",
        }, { status: 500 } );
  }
}