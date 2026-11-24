import { NextResponse, type NextRequest } from "next/server";
import { forwardProfileRequest } from "@/src/features/profile/apis/profile.server";
import { changePasswordSchema } from "@/src/features/profile/schema/profile.schema";

export async function PUT(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid request body." }, { status: 400 }); }
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid password data." }, { status: 400 });
  return forwardProfileRequest(request, { method: "PUT", path: "changeMyPassword", body: parsed.data });
}
