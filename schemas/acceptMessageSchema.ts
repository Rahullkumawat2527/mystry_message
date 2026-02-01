import { z } from "zod"

export const signinSchema = z.object({
    acceptMessages: z.boolean(),
})