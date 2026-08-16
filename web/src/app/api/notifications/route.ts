import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

// GET: The mobile app will poll this to get the latest active notification
export async function GET(req: NextRequest) {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.join(publicDir, "active-notification.json");
    
    try {
      const data = await readFile(filePath, "utf-8");
      return NextResponse.json(JSON.parse(data));
    } catch (err: any) {
      if (err.code === "ENOENT") {
        return NextResponse.json({ id: null, title: "", message: "", timestamp: 0 });
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Error reading notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Admin panel uses this to send a new notification
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message, category } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const payload = {
      id: Date.now().toString(),
      title,
      message,
      category: category || "System",
      timestamp: Date.now()
    };

    const publicDir = path.join(process.cwd(), "public");
    
    // Ensure directory exists
    try {
      await mkdir(publicDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const filePath = path.join(publicDir, "active-notification.json");
    await writeFile(filePath, JSON.stringify(payload, null, 2));

    return NextResponse.json({ success: true, notification: payload });
  } catch (error: any) {
    console.error("Error writing notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
