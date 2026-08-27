import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const useAuth = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = () => {
      const token = localStorage.getItem("_at");

      if (pathname.startsWith("/student") && !token) {
        router.replace("/login");
      }

      if (isMounted) {
        setIsAuthenticated(!!token);
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  return { loading, isAuthenticated };
};

export default useAuth;
