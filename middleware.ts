import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("adminToken")?.value;

    //Protect /admin route
    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login",req.url));
        }
    }
    return NextResponse.next();
}

//define what routes this middleware applies to:
export const config = {
    matcher: ["/admin/:path*"]
};
