import { useEffect, useState } from "react";
import studentService from "@/services/StudentService";

export function useLoggedInStudent() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            setLoading(true);
            try {
                const response = await studentService.getLoggedInUser();
                setStudent(response?.data || null);
                console.log(`Logged in user:`, response?.data);
            } catch (err) {
                setError(err);
                setStudent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLoggedInUser();
    }, []);

    return { student, loading, error };
}
