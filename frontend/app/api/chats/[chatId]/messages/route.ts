import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { chatId: string } }
) {
    try {
        const messagesRef = collection(db, "messages");
        const q = query(
            messagesRef,
            where("chatId", "==", params.chatId),
            orderBy("timestamp", "asc")
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json({ messages: [] }); // Return an empty array if no messages exist
        }

        const messages = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { chatId: string } }
) {
    try {
        const { message, sender } = await req.json();
        if (!message || !sender) {
            return NextResponse.json(
                { error: "Message and sender are required." },
                { status: 400 }
            );
        }

        // Add message to Firestore (collection is created automatically if it doesn't exist)
        await addDoc(collection(db, "messages"), {
            chatId: params.chatId,
            message,
            sender,
            timestamp: new Date(),
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
