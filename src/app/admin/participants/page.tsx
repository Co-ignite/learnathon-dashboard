"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { Participant } from "@/app/models/participant";
import { CollegeRegistration } from "@/app/models/registration";
export default function Component() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    registrationId: "",
    participantName: "",
  });
  const [registrations, setRegistrations] = useState<CollegeRegistration[]>([]);

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    fetchParticipants(true);
  }, [debouncedFilters]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/colleges");
      const data = await response.json();
      if (response.ok) {
        setRegistrations(data.registrations);
      } else {
        console.error("Failed to fetch registrations:", data.error);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const fetchParticipants = async (reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pageSize: "10",
        ...(debouncedFilters.registrationId && {
          registrationId: debouncedFilters.registrationId,
        }),
        ...(debouncedFilters.participantName && {
          participantName: debouncedFilters.participantName,
        }),
        ...(lastDoc && !reset && { lastDoc }),
      });

      const response = await fetch(`/api/participants?${params}`);
      const data = await response.json();

      if (response.ok) {
        setParticipants(
          reset ? data.participants : [...participants, ...data.participants]
        );
        setLastDoc(data.lastDoc);
        setHasMore(data.hasMore);
      } else {
        console.error("Failed to fetch participants:", data.error);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters) => (value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full m-auto">
      <CardHeader>
        <CardTitle>Participants List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Select
            value={filters.registrationId}
            onValueChange={(value) =>
              handleFilterChange("registrationId")(value)
            }
          >
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select College" />
            </SelectTrigger>
            <SelectContent>
              {registrations.map((registration) => (
                <SelectItem key={registration.id} value={registration.id ?? ""}>
                  {registration.collegeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search by participant name"
            value={filters.participantName}
            onChange={(e) =>
              handleFilterChange("participantName")(e.target.value)
            }
            className="max-w-xs"
          />
        </div>

        {filters.registrationId &&
          registrations.find((r) => r.id === filters.registrationId) && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {registrations
                    .filter(
                      (registration) =>
                        registration.id === filters.registrationId
                    )
                    .map((registration) => (
                      <div key={registration.id} className="space-y-4">
                        <div>
                          <div className="font-medium">
                            Representative Details
                          </div>
                          <div>Name: {registration.repName}</div>
                          <div>Email: {registration.repEmail}</div>
                          <div>Contact: {registration.repContact}</div>
                          <div>Role: {registration.role}</div>
                        </div>
                        <div>
                          <div className="font-medium">
                            Registration Details
                          </div>
                          <div>
                            Payment Status: {registration.paymentStatus}
                          </div>
                          <div>
                            Participants:{" "}
                            {registration.uploadLater ? "Later" : "Uploaded"}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={`${participant.collegeId}-${participant.id}`}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.branch}</TableCell>
                  <TableCell>{participant.degree}</TableCell>
                  <TableCell>{participant.year}</TableCell>
                  <TableCell>{participant.percentage}%</TableCell>
                  <TableCell>{participant.contact}</TableCell>
                </TableRow>
              ))}
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!loading && participants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No participants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {hasMore && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchParticipants()}
              disabled={loading}
            >
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
