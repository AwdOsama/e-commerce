import * as zod from "zod";

export const registerSchema = zod.object({
  name: zod
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: zod
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: zod
    .string()
    .min(1, "Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
    ),
  rePassword: zod.string().min(1, "Please confirm your password"),
  phone: zod
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(002)?01[0-25]\d{8}$/,
      "Enter a valid Egyptian mobile number (e.g. 01012345678)",
    ),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
});

export type regitsreSchemeType = zod.infer<typeof registerSchema>;
