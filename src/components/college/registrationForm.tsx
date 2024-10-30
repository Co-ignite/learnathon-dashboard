/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CollegeDetailsForm from "@/components/college/collegeForm";
import FileUploadForm from "@/components/college/fileUploadForm";
import PaymentForm from "@/components/college/paymentForm";
import { RegistrationSteps } from "@/components/college/registrationSteps";
import RegistrationCompleted from "./registrationCompleted";

export default function RegistrationProcess(props: {
  collegeId: string;
  returnURL: string;
}) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    collegeName?: string;
    Name?: string;
    Email?: string;
    Contact?: string;
    Amount?: number;
    collegeId?: string;
  }>({});
  const router = useRouter();

  const handleStepComplete = (data: { [key: string]: any }) => {
    const params = new URLSearchParams(window.location.search);

    if (step === 1 && data.id) {
      params.set("id", data.id);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.push(newUrl);
    } else if (step === 2) {
      setStep(3);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (props.collegeId !== "") {
      fetch(
        "process.env.NEXT_PUBLIC_BACKEND_URL/api/colleges/registration-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: props.collegeId }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            if (data.step) {
              setStep(data.step);
              if (data.step === 3) {
                setParticipantCount(data.participantCount);
                setFormData({
                  Name: data.name,
                  Email: data.email,
                  Contact: data.contact,
                  Amount: (data.price || 1000) * data.participantCount,
                  collegeId: data.collegeId,
                });
              }
            } else if (data.registered) {
              setFormData({
                collegeName: data.collegeName,
              });
              setStep(4);
            }
          } else {
            console.error("Error:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setStep(1);
    }
    setLoading(false);
  }, [props, step]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  } else
    return (
      <>
        {step <= 3 ? (
          <Card className="w-full max-w-2xl mx-auto my-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                College Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RegistrationSteps currentStep={step} />
              {step === 1 && (
                <CollegeDetailsForm onComplete={handleStepComplete} />
              )}
              {step === 2 && (
                <FileUploadForm
                  onComplete={handleStepComplete}
                  collegeId={props.collegeId}
                />
              )}
              {step === 3 && (
                <PaymentForm
                  returnURL={props.returnURL}
                  formData={formData}
                  participantCount={participantCount}
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <RegistrationCompleted
            collegeName={formData.collegeName!}
            dashboardURL="/admin/dashboard"
          />
        )}
      </>
    );
}
