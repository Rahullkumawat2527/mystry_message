import { z } from "zod"

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, { error: "content must be atleast 10 characters " })
        .max(300, { error: "content must not exceed 300 characters" })
})