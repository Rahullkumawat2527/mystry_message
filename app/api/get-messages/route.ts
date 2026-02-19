import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth"
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect()

    const session = getServerSession(authOptions)
    const user = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "user is not authenticated"
        }, { status: 401 })
    }

    // agar hum aggregation pipeline use karenge to ho sakta ha ki hamara jo user id string me ha wo problem kar de to hum isko mongoose ke object ke convert kar denge
    const userId = new mongoose.Types.ObjectId(user._id)

}
