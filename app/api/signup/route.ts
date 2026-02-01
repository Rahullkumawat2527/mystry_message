import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcrypt"
import { success } from "zod";

export async function POST(request:Request){
    await dbConnect()

    try {
        const{username,email,password} = await request.json()
        
        
    } catch (error) {
        console.error("Error while registering user",error)
        return Response.json({
            success : false,
            message : "Error while registering user"
        },
        {
            status : 500
        }
    )
        
    }
}