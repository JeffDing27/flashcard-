import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ref = collection(db, "test"); // new test collection
    await addDoc(ref, { hello: "world" });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
