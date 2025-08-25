import {Suspense} from "react";
import VerifyForgotPasswordOtpClient from "@/app/(auth)/forgot-password/otp/ForgotPasswordOtp";
import LogoLoading from "@/lib/LogoLoading";

export default function ForgotPasswordOtp() {
    return (
        <Suspense fallback={<LogoLoading/>}>
            <VerifyForgotPasswordOtpClient/>
        </Suspense>
    );
}
