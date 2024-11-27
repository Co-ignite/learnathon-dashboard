"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { CardFooter } from "src/components/ui/card";
import { Checkbox } from "src/components/ui/checkbox";

const formSchema = z.object({
  state: z.string().min(1, "Please select a state"),
  district: z.string().min(1, "Please select a district"),
  collegeName: z.string().min(1, "Please select a college"),
  repName: z
    .string()
    .min(2, "Representative name must be at least 2 characters"),
  repEmail: z.string().email("Invalid email address"),
  repContact: z.string().min(10, "Contact number must be at least 10 digits"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  agreeToTerms: z.boolean().refine((value) => value, { message: 'You must agree to the terms and conditions' }),
});

type FormValues = z.infer<typeof formSchema> & { id?: string };

// Mock data for states, districts, and colleges
const states = [
  "Andaman & Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhatisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttrakhand",
  "West Bengal",
];

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="text-white">Loading...</div>
  </div>
);

export default function CollegeDetailsForm(props: {
  onComplete: (data: { id: string }) => void;
}) {
  const [colleges, setColleges] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: "",
      district: "",
      collegeName: "",
      repName: "",
      repEmail: "",
      repContact: "",
      role: "",
      agreeToTerms: false,
    },
  });

  useEffect(() => {
    const getDistricts = async (state: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/colleges/get-districts?state=${state}`
        );

        if (!response.ok) throw new Error("Failed to fetch districts");

        const data = await response.json();
        setDistricts(data.districts);
      } catch (error) {
        console.error("Error fetching districts:", error);
        toast({
          title: "Error",
          description: "Failed to fetch districts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    if (selectedState) {
      getDistricts(selectedState);
      form.setValue("district", "");
      form.setValue("collegeName", "");
    }
  }, [selectedState, form]);

  useEffect(() => {
    const getColleges = async (district: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/colleges/get-colleges?district=${district}`
        );
        if (!response.ok) throw new Error("Failed to fetch colleges");

        const data = await response.json();
        setColleges(data.colleges);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        toast({
          title: "Error",
          description: "Failed to fetch colleges. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (selectedDistrict) {
      getColleges(selectedDistrict);
      form.setValue("collegeName", "");
    }
  }, [selectedDistrict, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (!data) throw new Error("Failed to update college details");
      console.log("data is " + JSON.stringify(data));
      const response: Response = await fetch("/api/colleges/college-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      console.log("response data is " + JSON.stringify(responseData));
      if (!responseData.success) {
        toast({
          title: "Error",
          description:
            responseData.message ||
            "Failed to update college details. Please try again.",
          variant: "destructive",
        });
        return;
      }

      props.onComplete({
        id: responseData.id,
      });

      toast({
        title: "College details saved",
        description: "Your college details have been successfully saved.",
      });
    } catch (error) {
      console.error("Error updating college details:", error);
      toast({
        title: "Error",
        description: "Failed to save college details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedState(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white max-h-60 overflow-y-auto">
                    {states.map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="hover:bg-gray-100"
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <Select
                  disabled={selectedState === null}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedDistrict(value);
                    form.setValue("collegeName", "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white max-h-60 overflow-y-auto">
                    {selectedState &&
                      districts.map((district) => (
                        <SelectItem
                          key={district}
                          value={district}
                          className="hover:bg-gray-100"
                        >
                          {district}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="collegeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College</FormLabel>
                <Select
                  disabled={selectedDistrict === null}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Search for a college" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white max-h-60 overflow-y-auto">
                    {selectedDistrict &&
                      colleges.map((college) => (
                        <SelectItem
                          key={college}
                          value={college}
                          className="hover:bg-gray-100"
                        >
                          {college}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {["repName", "repEmail", "repContact"].map((name) => (
            <FormField
              control={form.control}
              name={name as keyof FormValues}
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>
                    {name
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${name}`}
                      value={value as string}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select
              onValueChange={(value) => {
                form.setValue("role", value);
              }}
              defaultValue={form.getValues("role") as string}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white max-h-60 overflow-y-auto">
                {["HOD", "Principal", "Dean", "TPO"].map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    className="hover:bg-gray-100"
                  >
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={!!value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <label
              htmlFor="agreeToTerms"
              className="text-sm text-gray-500"
            >I agree to the <a href="/terms-and-conditions" className="text-blue-500 hover:underline">terms and conditions</a></label>
          </div>
          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      </Form>
      <CardFooter className="flex justify-center mt-8">
        <p className="text-sm text-gray-600">
          Already registered?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            login
          </a>
        </p>
      </CardFooter>
    </>
  );
}
