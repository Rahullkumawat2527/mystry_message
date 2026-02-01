import {z} from "zod"

const userRegex = /^[a-zA-z][a-zA-Z0-9_]+$/
export const usernameValidation = z
    .string()
    .min(2,"username must be atleast 2 characters")
    .max(20,"username must be atmost 20 characters")
    .regex(userRegex,"Username must not contain special characters")


export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.email({pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,error:"Invalid email address"}),
    password : z.string().min(6,{error:"password must be atleast 6 chracters"})
})