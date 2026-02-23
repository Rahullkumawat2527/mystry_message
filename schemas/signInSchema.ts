import { z } from "zod"

export const signinSchema = z.object({
    indentifier: z.string(),  // identifier means email,used in production
    password : z.string()
})