"use client";
import { useState, useEffect } from "react";
import RegistrationProcess from "@/components/college/registrationForm";

export default function AddCollege() {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get("id") !== null) {
      setId(params.get("id") ?? "");
    } else {
      setId("");
    }
    setLoading(false);
  }, []);
  if (loading)
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  else
    return (
      <div className="h-full m-auto">
        <RegistrationProcess
          returnURL="process.env.NEXT_PUBLIC_BACKEND_URL/admin/colleges/status"
          collegeId={id}
        />
      </div>
    );
}
