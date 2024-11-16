"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { Loader2 } from "lucide-react";
import { CollegeRegistration } from "@/app/models/registration";
import { Button } from "src/components/ui/button";

export default function CollegeRegistrationDetails() {
  const [registrations, setRegistrations] = useState<CollegeRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get("/api/colleges");
        if (response.data.success) {
          setRegistrations(response.data.registrations);
        }
      } catch (error) {
        console.error("Failed to fetch college registrations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex flex-row justify-between font-bold">
          Colleges
          <Button>
            <a href="/admin/colleges/add">Add College</a>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College Name</TableHead>
                <TableHead>Representative</TableHead>
                <TableHead>Rep Role</TableHead>
                <TableHead>Rep Email</TableHead>
                <TableHead>Rep Contact</TableHead>
                <TableHead>Coupon</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Upload Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow
                  onClick={() => {
                    window.location.href = `/admin/colleges/add?id=${reg.id}`;
                  }}
                  key={reg.id}
                >
                  <TableCell className="font-medium">
                    {reg.collegeName}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>{reg.repName}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>{reg.role}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>{reg.repEmail}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>{reg.repContact}</div>
                  </TableCell>
                  <TableCell>{reg.coupon || "N/A"}</TableCell>
                  <TableCell>{reg.paymentStatus}</TableCell>
                  <TableCell>{reg.uploadLater ? "No" : "Yes"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
