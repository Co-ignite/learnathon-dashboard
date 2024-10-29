import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, writeBatch, updateDoc } from "firebase/firestore";
import { Readable } from "stream";
import csv from "csv-parser";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const collegeId = formData.get("collegeId") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    let participants: Record<string, any>[] = [];
    let columns: string[] = [];

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.name.split(".").pop()?.toLowerCase();

    if (fileType === "csv") {
      // Parse CSV file
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      await new Promise((resolve, reject) => {
        readableStream
          .pipe(
            csv({
              skipLines: 0,
              headers: true,
              trim: true,
            })
          )
          .on("headers", (headers) => {
            columns = headers;
          })
          .on("data", (data) => participants.push(data))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (["xlsx", "xls", "ods"].includes(fileType || "")) {
      // Parse Excel file
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        columns = jsonData[0] as string[];
        participants = jsonData.slice(1).map((row) => {
          const participant: Record<string, any> = {};
          columns.forEach((col, index) => {
            participant[col] = row[index];
          });
          return participant;
        });
      }
    } else {
      return NextResponse.json(
        {
          message: "Unsupported file type. Please upload a CSV or Excel file.",
        },
        { status: 400 }
      );
    }

    const requiredColumns = [
      "Name",
      "Email",
      "Contact",
      "Degree",
      "Branch",
      "Year",
      "Percentage",
    ];

    // Check if the file has the required columns
    const missingColumns = requiredColumns.filter(
      (column) => !columns.includes(column)
    );

    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          message: "File is missing required columns",
          missingColumns,
          requiredColumns,
          givenColumns: columns,
        },
        { status: 400 }
      );
    }

    // Add participants to Firestore in batches
    const batchSize = 500;
    const batches = [];

    for (let i = 0; i < participants.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchParticipants = participants.slice(i, i + batchSize);

      batchParticipants.forEach((participant) => {
        const participantDocRef = doc(
          collection(db, "participants", collegeId, "participants")
        );
        batch.set(participantDocRef, participant);
      });

      batches.push(batch.commit());
    }

    await Promise.all(batches);

    const collegeDocRef = doc(db, "registrations", collegeId);

    // update uploadLater to false
    await updateDoc(collegeDocRef, {
      uploadLater: false,
    });

    return NextResponse.json(
      {
        message: "Participants uploaded successfully",
        count: participants.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading participants:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
