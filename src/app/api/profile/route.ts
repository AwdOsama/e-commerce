import { NextResponse, type NextRequest } from "next/server";
import { forwardProfileRequest } from "@/src/features/profile/apis/profile.server";
import { profileSchema } from "@/src/features/profile/schema/profile.schema";

export async function GET(request: NextRequest) {
  return forwardProfileRequest(request, { method: "GET", path: "getMe" });
}

export async function PUT(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid request body." }, { status: 400 }); }
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid profile data." }, { status: 400 });
  return forwardProfileRequest(request, { method: "PUT", path: "updateMe", body: parsed.data });
}
