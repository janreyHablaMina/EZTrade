import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("apk") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.endsWith(".apk")) {
      return NextResponse.json({ error: "Invalid file type. Only .apk is allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/releases/app.apk
    const publicDir = path.join(process.cwd(), "public", "releases");
    
    // Ensure directory exists
    try {
      await mkdir(publicDir, { recursive: true });
    } catch (e) {
      // Ignore if directory already exists
    }

    const filePath = path.join(publicDir, "app.apk");
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, url: "/releases/app.apk" });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
