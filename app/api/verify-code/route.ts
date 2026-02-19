import NextAuth from "next-auth";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
    await dbConnect()


    try {
        // console.log(request)
        const { username, code } = await request.json()
        // console.log(username, code)

        // yaha hum url me se username jo nikala ha use hum decodeURIComponent method ki help se decode kar lenge taki agar user me kuch character encode  huwe ha to(like space ki jagah %20 ) to wo hum decode kar paye with space (very helpful)

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }

        // agar user ha to hum verify karenge ki uske pass jo verifycode ha wo valid ha ya nhi ha aur hum uski expiryDate bhi check karenge (ki wo abhi se jyada hone chahiye jabb humne user verify kiya tab se)

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        // if, agar code valid ha aur saath hi code ki expiry date  jayada ha abhi se to hum user ko verify kar denge aur use first db me save kara denge
        // aur fir ek response send kar denge ki account verified successfully ka
        //else if, lekin agar hamara verify code expire ho gaya ha to hum user ko ek response bhejenge to sign in again to generate new verification code
        // else, agar verify code hi galat ha to hum sidha user ko response bhej denge ki verification code is wrong

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified Successfully"
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired please sign up again to get a new code"
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification code "
            }, { status: 400 })
        }

    } catch (error) {
        console.error("Error while verifying user", error)
        return Response.json({
            success: false,
            message: "Error while verifying user"
        }, { status: 500 })
    }
}