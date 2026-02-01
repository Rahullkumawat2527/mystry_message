import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    // using getToken to get the json web token
    const token = await getToken({ req: request })
    // using the nextURL to get the current url
    const url = request.nextUrl

    // agar apke pass token and aur app sign-in ya sign-up ya verify pe ja rhe ho to hum apko redirect kar denge dashboard because you already have token then why are you going to the sign-in page  or any other where you will generate token to access content even though you already have token to sign-in and generate token

    if (token && (
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify") ||
        url.pathname.startsWith("/")
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))

    }



    return NextResponse.redirect(new URL('/home', request.url))
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }


// below the paths where our middlewares will work
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
}