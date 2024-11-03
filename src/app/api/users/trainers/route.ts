import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { User } from "@/app/models/user";

export async function GET() {
  try {
    const userCollectionRef = collection(db, "users");

    const trainerQuery = query(
      userCollectionRef,
      where("role", "==", "Trainer")
    );

    const users = await getDocs(trainerQuery);

    const userList: User[] = users.docs.map((doc) => {
      const user = doc.data() as User;
      user.id = doc.id;
      return user;
    });
    return NextResponse.json(
      {
        success: true,
        users: userList,
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
