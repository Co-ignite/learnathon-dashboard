"use client"

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect } from "react";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      if (user) {
        console.log(user);
        try {
          const response = await axiosInstance.get(`/api/auth?uid=${user.uid}`);
          console.log(response);
          if (response.status === 200) {
            const userData = response.data.data;
            sessionStorage.setItem("userData", JSON.stringify(userData));
            console.log(userData);
            if (userData.role === "Admin") {
              router.push("/admin");
            } else {
              router.push("/dashboard");
            }
          }
        } catch (error) {
          console.log(error);
          auth.signOut();
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };

    if (loading) return;
    getUserData();
  }, [loading, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      Loading...
    </div>
  );
}
