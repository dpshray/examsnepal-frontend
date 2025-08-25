// import {NextFetchEvent, NextRequest, NextResponse} from "next/server";
// import {verifyAuth} from "./lib/auth";
//
// /**
//  * Middleware to protect sensitive routes by verifying authentication.
//  * Applies to both admin and student routes (including their API endpoints).
//  */
// export async function middleware(req: NextRequest, event: NextFetchEvent) {
//     const {pathname} = req.nextUrl;
//
//     // Define all protected route prefixes
//     const protectedPaths = [
//         "/admin",
//         "/api/admin",
//         "/student",
//         "/api/student",
//     ];
//
//     // Check if the current request path is protected
//     const isProtectedRoute = protectedPaths.some((path) =>
//         pathname.startsWith(path)
//     );
//
//     if (isProtectedRoute) {
//         try {
//             // Attempt to verify the user's authentication token
//             const verifiedToken = await verifyAuth(req);
//
//             // If the token is invalid or missing, handle unauthorized access
//             if (!verifiedToken) {
//                 if (pathname.startsWith("/api/")) {
//                     // For API routes, return a 401 JSON response
//                     return new NextResponse(
//                         JSON.stringify({error: {message: "Authentication required"}}),
//                         {
//                             status: 401,
//                             headers: {"Content-Type": "application/json"},
//                         }
//                     );
//                 } else {
//                     // For page routes, redirect to the homepage or login page
//                     return NextResponse.redirect(new URL("/", req.url));
//                 }
//             }
//         } catch (err: any) {
//             console.error("Authentication error:", err?.message || err);
//             return new NextResponse(
//                 JSON.stringify({error: {message: "Authentication error"}}),
//                 {
//                     status: 500,
//                     headers: {"Content-Type": "application/json"},
//                 }
//             );
//         }
//     }
//
//     // Continue to the next middleware or route handler
//     return NextResponse.next();
// }
//
// /**
//  * Matcher configuration ensures this middleware only runs on specific paths.
//  */
// export const config = {
//     matcher: [
//         "/admin/:path*",
//         "/api/admin/:path*",
//         "/student/:path*",
//         "/api/student/:path*",
//     ],
// };
