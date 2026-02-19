import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { success, z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})


// hum ek GET function likh ye functionality hume kam aayegi jab user apna name type kar raha hoga aur hum use usi time ye bata denge ki user name available ha ki nhi h ya username valid ha ya nhi h

export async function GET(request: Request) {
    // yaha hum iss route pe bss GET request accept kar rhe ha lekin maan lo agar koi user yaha POST request kar de to hum usko db se connect karne se pehle hi response bhej denge ki iss route pe hum sirf GET request hi accept kar rhe h


    // pehle hum db se connect kar lenge taki username check kar sake
    await dbConnect()


    try {
        // yaha hum username check karenge using url
        // koi bhi jabb username check karege(ki username already taken or not , it is a valid username) to mujhe query bhej dega url ke andar hi (jo ki get request se aayegi)


        console.log(request)
        // below we are extracting query from the url through get request
        const { searchParams } = new URL(request.url)

        // console.log(searchParams) URLSearchParams { 'username' => 'nextjsrahulkumawat' }

        // abb ho sakta ha ki url me bahut sari query ho lekin hume sirf username chahiye to ye username hum searchParams se nikal lenge using get method and will pass that query name that we need
        const queryParam = {
            username: searchParams.get('username')
        }

        // abb hume jo url me se username query mili ha use hum validate bhi karenge using zod
        // yaha safeParse se kya hoga agar parsing sahi huwi schema match huwa to hume value mil jayegi otherwise nhi milegi
        const result = UsernameQuerySchema.safeParse(queryParam)


        // console.log(result) { success: true, data: { username: 'nextjsrahulkumawat' } }


        // agar username me kuch problem ha to error de denge ya user ko bata denge ki apka return username is not follwing the format that we set
        if (!result.success) {
            // yaha result.error me saare error hote ha in the form of stack so from this error stack we are just exacting username error or agar error nhi ha to hum empty [] rakh denge
            const usernameError = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(", ") : "Invalid query paramters",
            }, { status: 400 })

        }

        // yaha hum result se data field nikalenge aur usme hume given username mil jayega
        const { username } = result.data

        // fir hum apne db me check karenge ki jo username diya ha wo kya db me already present agar already present ha to hum ek response bhej with message that username is already taken
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, { status: 400 })
        }

        // agar username exist nhi karta db me to hum return kar denge response with message that given username is unique

        return Response.json({
            success: true,
            message: "username is unique"
        }, { status: 200 })



    } catch (error) {
        console.error("Error while checking username", error)
        return Response.json({
            success: false,
            message: "Error while checking username"
        }, { status: 500 })

    }

}