import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { User } from "@/app/models/user";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export async function GET() {
  try {
    const userCollectionRef = collection(db, "users");

    const users = await getDocs(userCollectionRef);

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, email, contact } = body;

    await createUserWithEmailAndPassword(
      auth,
      email,
      "password1234" // Replace with a secure password generation method
    ).then((userCredential) => {
      // add user to the database
      const newUser = {
        name,
        role,
        email,
        contact,
      };

      const userCollectionRef = doc(db, "users", userCredential.user.uid);

      setDoc(userCollectionRef, newUser);

      sendPasswordResetEmail(auth, email);
    });

    return NextResponse.json(
      {
        success: true,
        message: "User added successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to add trainer:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add trainer",
      },
      { status: 500 }
    );
  }
}
