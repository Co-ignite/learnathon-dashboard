/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Upload, File, FileDownIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
];

const formSchema = z.object({
  participantsFile: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      "File size should be less than 5MB"
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      "Only Excel or CSV files are allowed"
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function FileUploadForm(props: {
  onComplete: (data: any) => void;
  collegeId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      countParticipants(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const countParticipants = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (file.type === "text/csv") {
        Papa.parse(data as string, {
          complete: (results) => {
            setParticipantCount(results.data.length - 1); // Assuming the first row is the header
          },
        });
      } else {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setParticipantCount(jsonData.length);
      }
    };
    reader.readAsBinaryString(file);
  };

  const onSubmit = async () => {
    try {
      if (file) {
        const userConsent = window.confirm(
          `The current count is ${participantCount}. Do you want to proceed with the upload?`
        );

        if (!userConsent) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("collegeId", props.collegeId);

        // API call to update Firestore
        const uploadResponse = await fetch(
          "/api/colleges/upload-participants",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) throw new Error("Failed to upload file");

        toast({
          title: "File uploaded",
          description: "Your participants file has been successfully uploaded.",
        });
      } else {
        console.error("No file selected");
        toast({
          title: "Error",
          description: "No file selected",
          // variant: "destructive",
        });
        return;
      }
      props.onComplete({ participantsFile: file });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="participantsFile"
          render={() => (
            <FormItem>
              <FormLabel>Upload Participants Excel Sheet</FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/25 hover:border-primary"
                  }`}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="flex items-center justify-center space-x-2">
                      <File className="h-8 w-8 text-muted-foreground" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag & drop an Excel or CSV file here, or click to
                        select one
                      </p>
                    </div>
                  )}
                </div>
              </FormControl>
              <div className="my-4 border p-4 rounded text-sm">
                <li>Max file size: 5MB</li>
                <li>Accepted file types: .xlsx, .xls, .csv</li>
                <li>File should contain a header row</li>
                <li>
                  The file should have the following columns:
                  <div className="ml-4">
                    <li>
                      Name
                      <span> (example: John Doe)</span>
                    </li>
                    <li>
                      Email
                      <span> (example: abc@gmail.com)</span>
                    </li>
                    <li>
                      Contact
                      <span> (example: +91 9876543210)</span>
                    </li>
                    <li>
                      Degree
                      <span> (example: B.Tech)</span>
                    </li>
                    <li>
                      Branch
                      <span> (example: CSE)</span>
                    </li>
                    <li>
                      Year
                      <span> (example: 1, 2, 3, 4)</span>
                    </li>
                  </div>
                </li>
              </div>
              <Button
                type="button"
                onClick={() => {
                  window.open("/sample/sample-participants-file.xlsx");
                }}
              >
                <FileDownIcon />
                Download Sample File
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>
    </Form>
  );
}
