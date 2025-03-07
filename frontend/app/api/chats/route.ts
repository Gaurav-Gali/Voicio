import { db } from "@/lib/firebase";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const chats = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json(chats);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        const chatRef = await addDoc(collection(db, "chats"), {
            name,
            createdAt: new Date(),
        });

        return NextResponse.json({ id: chatRef.id, name }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
