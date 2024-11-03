"use client";

import { useState, useEffect } from "react";
import RegistrationProcess from "@/components/college/registrationForm";
import { CardFooter } from "@/components/ui/card";

export default function Register() {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  useEffect(() => {
    setLoading(true);
    const getCollegeDetails = async () => {
      const user = JSON.parse(sessionStorage.getItem("userData") ?? "{}");

      const response = await fetch("/api/colleges/user-college", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMail: user.email }),
      });

      if (response.status === 200) {
        const data = await response.json();
        if (data.success) {
          if (data.id) {
            setId(data.id);
          }
        }
      }
      setLoading(false);
    };
    const params = new URLSearchParams(window.location.search);
    if (params.get("id") !== null) {
      setId(params.get("id") ?? "");
      setLoading(false);
    } else {
      getCollegeDetails();
    }
  }, []);
  if (loading)
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  else
    return (
      <div className="h-full m-auto">
        <RegistrationProcess
          returnURL={`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/register/status`}
          collegeId={id}
        />
      </div>
    );
}
