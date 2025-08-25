import ForgotPasswordReset from "@/app/(auth)/forgot-password/reset/ForgotPasswordReset";
import LogoLoading from "@/lib/LogoLoading";
import {Suspense} from "react";


export default function ResetPassword() {
    return (
        <Suspense fallback={<LogoLoading/>}>
            <ForgotPasswordReset/>
        </Suspense>
    );
}