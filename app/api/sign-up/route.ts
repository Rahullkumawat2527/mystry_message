import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcrypt"
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()

        const existingUserVerifiedByEmail = await UserModel.findOne({
            username,
            isVerified: true
        })
        // yaha hum user ko username aur saath hi wo verified ha ki nahi uss cheez se check kar rhe h
        if (existingUserVerifiedByEmail) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, { status: 400 })
        }

        // jabb hum user ko email se varify karte h
        const verifyingUserByEmail = await UserModel.findOne({ email })

        // generating a verify code using math object classes
        const verifyCode = Math.floor(10000 + Math.random() * 80000).toString()
        
        // scenerio when user is also present 
        if (verifyingUserByEmail) {

            // user is present and also verify jo here just send response that user is already present
            if(verifyingUserByEmail.isVerified){
                return Response.json({
                    success : false,
                    message : "user is already registered"
                },{status : 400})
            }

            const hashedPassword = await bcrypt.hash(password,10)

            // kya pata jo user exist karta ha to usko password yaad na ho ya kuch aur ho to hum existing passord ko update kar denge with hashedPassword
            verifyingUserByEmail.password =  hashedPassword
            verifyingUserByEmail.verifyCode = verifyCode
            verifyingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

            await verifyingUserByEmail.save()
        
            // scenerio when user is not present means new user,here we will create a new user ans store it in the db documents
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            newUser.save()

        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User created successfully, Please Verify Your Email"
        }, { status: 201 })

    } catch (error) {
        console.error("Error while registering user", error)
        return Response.json({
            success: false,
            message: "Error while registering user"
        },
            {
                status: 500
            }
        )

    }
}