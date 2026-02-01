import { z } from "zod"

export const signinSchema = z.object({
    indentifier: z.string(),
    password : z.string()
})