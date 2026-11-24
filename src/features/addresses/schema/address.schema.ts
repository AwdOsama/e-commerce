import * as z from "zod";

export const addressSchema = z.object({
  name: z.string().trim().min(2, "Enter a name for this address"),
  details: z.string().trim().min(5, "Enter the street and building details"),
  phone: z.string().trim().regex(/^(002)?01[0-25]\d{8}$/, "Enter a valid Egyptian mobile number"),
  city: z.string().trim().min(2, "Enter your city"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
