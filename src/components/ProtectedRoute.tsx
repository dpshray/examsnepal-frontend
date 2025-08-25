'use client';

import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';
import LogoLoading from '@/lib/LogoLoading';

const PUBLIC_PATHS = ['/', '/about', '/contact'];
const DASHBOARD_ROUTE = '/student/dashboard';

export default function ProtectedRoute({ children }: PropsWithChildren) {
    const pathname = usePathname();
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('_at') : null;

            const isPublicPath = PUBLIC_PATHS.includes(pathname);
            const isStudentPath = pathname.startsWith('/student');

            // If logged in and on a public page -> redirect to dashboard
            if (token && isPublicPath) {
                router.replace(DASHBOARD_ROUTE);
                return;
            }

            // If not logged in and on a protected (student) page -> redirect to login
            if (!token && isStudentPath) {
                router.replace('/login');
                return;
            }

            // No redirect needed, allow rendering
            setCheckingAuth(false);
        };

        checkAuth();
    }, [pathname, router]);

    // Don't render anything while checking auth
    if (checkingAuth) {
        return <LogoLoading />;
    }

    return <>{children}</>;
}
