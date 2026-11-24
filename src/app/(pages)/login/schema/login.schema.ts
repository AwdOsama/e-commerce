import * as zod from "zod";

export const loginSchema = zod.object({
  email: zod
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: zod.string().min(1, "Password is required"),
});

export type loginSchemaType = zod.infer<typeof loginSchema>;
