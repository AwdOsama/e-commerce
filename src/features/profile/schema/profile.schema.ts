import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().regex(/^(002)?01[0-25]\d{8}$/, "Enter a valid Egyptian mobile number"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Use uppercase, lowercase, a number, and a symbol"),
  rePassword: z.string().min(1, "Confirm your new password"),
}).refine((data) => data.password === data.rePassword, { path: ["rePassword"], message: "Passwords do not match" });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
