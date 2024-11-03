"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface RegistrationCompletedProps {
  collegeName: string;
  dashboardURL: string;
}

export default function RegistrationCompleted({
  collegeName,
  dashboardURL,
}: RegistrationCompletedProps) {
  const router = useRouter();

  return (
    <Card className="w-full max-w-md mx-auto my-10">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Registration Completed
        </CardTitle>
        <CardDescription className="text-center">
          Your participants have been successfully registered.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center px-4 py-2 bg-muted rounded-md">
          <span className="text-sm">{collegeName}</span>
        </div>
      </CardContent>
      {/* <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={() => router.push(dashboardURL)}>
          Go to Dashboard
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(dashboardURL)}
        >
          Register More Participants
        </Button>
      </CardFooter> */}
    </Card>
  );
}
