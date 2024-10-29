/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const formSchema = z.object({
  file: z.instanceof(File),
});

type FormValues = z.infer<typeof formSchema>;

export default function CollegeDataUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsUploading(true);
    try {
      const file = data.file;
      const results = await new Promise<Papa.ParseResult<any>>(
        (resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: resolve,
            error: reject,
          });
        }
      );

      const collegesCollection = collection(db, "states");

      for (const row of results.data) {
        await addDoc(collegesCollection, {
          // id: row["id"],
          // collegeName: row["collegeName"],
          // city: row["city"],
          // pinCode: row["pin_code"],
          // address_line: row["address_line1"] + row["address_line2"],
          state: row["state"],
          district: row["district"],
        });
      }

      toast({
        title: "Upload Successful",
        description: `${results.data.length} colleges have been uploaded to Firestore.`,
      });
    } catch (error) {
      console.error("Error uploading data:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-20">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload CSV File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload to Firestore"}
        </Button>
      </form>
    </Form>
  );
}
