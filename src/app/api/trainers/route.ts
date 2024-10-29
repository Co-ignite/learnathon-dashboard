import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const trainers = await getDocs(collection(db, "trainers"));
    const trainerList = trainers.docs.map((doc) => {
      const trainer = doc.data();
      trainer.id = doc.id;
      return trainer;
    });
    return NextResponse.json(
      {
        success: true,
        trainers: trainerList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching trainers",
      },
      { status: 500 }
    );
  }
}
