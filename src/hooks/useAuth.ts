import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const useAuth = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = () => {
            const token = localStorage.getItem("_at");

            if (pathname.startsWith("/student") && !token) {
                router.replace("/login");
            }

            if (isMounted) setLoading(false);
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [pathname, router]);

    return { loading };
};

export default useAuth;
