import { NextApiRequest, NextApiResponse } from 'next'
import { db } from "@/lib/firebase"
import { getDoc, collection, doc } from "firebase/firestore";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("handler called")
        const { uid } = req.query

        console.log(uid);

        // get user data from firestore db
        const userRef = doc(db, "users", uid as string)
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return res.status(200).send({
                success: false,
                message: "User not found",
            });
        }

        const userData = userDoc.data();

        return res.status(200).send({
            success: true,
            data: userData,
        });


    } catch (error) {
        // error fetching user
        console.error("Error fetching user:", error);
        return res.status(200).send({
            success: false,
            message: "Error fetching user",
        });
    }
}