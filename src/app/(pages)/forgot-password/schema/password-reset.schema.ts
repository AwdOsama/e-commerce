import * as z from "zod";

export const emailSchema = z.object({ email: z.string().trim().email("Enter a valid email address") });
export const codeSchema = z.object({ resetCode: z.string().trim().length(6, "Enter the 6-digit code") });
export const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Use uppercase, lowercase, a number, and a symbol"),
  confirmPassword: z.string().min(1, "Confirm your password"),
}).refine((value) => value.password === value.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export type EmailFormValues = z.infer<typeof emailSchema>;
export type CodeFormValues = z.infer<typeof codeSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
