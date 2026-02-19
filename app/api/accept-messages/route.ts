import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth"
// import { success } from "zod";

// getserversession(ye hame functionality provide karta ha to access the session in the backend) ki help se hum backend se hi session ki data nikal lenge(like user information jo ki apan ne auth option ke time pe  callback ki help se session me inject kiya tha)


export async function POST(request: Request) {

    await dbConnect()

    // sabse pehle hum session nikal lenge getServerSession(jo ki authoption as a paramter leta ha)
    const session = await getServerSession(authOptions)

    // if iss session se hum user nikal lenge
    // const user: User = session?.user  
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    // yaha abb hum nikale huwe user se _id field nikal lenge taki iss id ki madad se hum db me search kar sake
    const userId = user._id

    // yaha hum jo hume fronted se data aa rha for accepting messages(ye ek flag aayega true or false that user want to accept messages from the backend or not)
    const { acceptMessages } = await request.json()


    try {

        // yaha hum user ko userModel me search karenge using the id and uss user ke andar isAcceptingMessage kp update kar denge based on the fronted sended status
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        // agar hame updated user hi nhi mila to hum response bhej denge 
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "user not found,so failed to update accept messages field"
            }, { status: 401 })
        }

        // agar user h means hamne uske andar isAcceptingMessage update kar diya
        return Response.json({
            success: true,
            message: "message acceptance status updated successfully",
            updatedUser,
        }, { status: 200 })



    } catch (error) {
        console.error("failed to update user status to accept messages", error)
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 })
    }
}


export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "not Authenticated"
        }, { status: 401 })
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(usesId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })
    } catch (error) {
        console.log("Error in getting message acceptance status")
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, { status: 500 })
    }
}
