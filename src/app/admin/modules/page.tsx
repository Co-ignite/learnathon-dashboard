"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { ModuleConfirmation } from "@/app/models/moduleConfirmation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Modules() {
  const [modules, setModules] = useState<ModuleConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const getModules = async () => {
      try {
        const response = await axios.get(
          "process.env.NEXT_PUBLIC_BACKEND_URL/api/modules"
        );
        if (response.data.success) {
          setModules(response.data.modules);
        }
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      } finally {
        setLoading(false);
      }
    };
    getModules();
  }, []);

  const getStatusBadge = (status: string) => {
    const colorMap: { [key: string]: string } = {
      confirmed: "bg-green-500",
      pending: "bg-yellow-500",
      cancelled: "bg-red-500",
    };
    return (
      <Badge className={`${colorMap[status.toLowerCase()] || "bg-gray-500"}`}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl flex flex-row justify-between font-bold">
          Module Confirmation
          <Button>
            <a href="/admin/modules/form">Add Module</a>
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
                <TableHead>Status</TableHead>
                <TableHead>No of Batches/Students</TableHead>
                <TableHead>Financials</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Is MOU Signed</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Trainers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module: ModuleConfirmation) => (
                <TableRow
                  onClick={() => {
                    router.push(`/admin/modules/form?id=${module.id}`);
                  }}
                  key={module.id}
                >
                  <TableCell className="font-medium">
                    {module.registration.collegeName}
                  </TableCell>
                  <TableCell>{module.representative}</TableCell>
                  <TableCell>{module.no_of_batches_students.length}</TableCell>
                  <TableCell>{module.financials}</TableCell>
                  <TableCell>{module.dates}</TableCell>
                  <TableCell>{module.is_mou_signed ? "Yes" : "No"}</TableCell>
                  <TableCell>{module.notes}</TableCell>
                  <TableCell>{module.trainers}</TableCell>
                  <TableCell>{getStatusBadge(module.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
