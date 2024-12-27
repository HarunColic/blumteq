import { useEffect } from "react";
import { useAuth } from "@/app/auth-context";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const unprotectedPaths = ["/login", "/register", "/"];

    useEffect(() => {
        if (isLoading) return;

        const currentPath = window.location.pathname;

        if (!user && !unprotectedPaths.includes(currentPath)) {
            router.push("/login");
        }

        if (user && unprotectedPaths.includes(currentPath)) {
            router.push("/hours");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return null;
    }

    return <>{children}</>;
}
