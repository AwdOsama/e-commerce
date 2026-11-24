import * as z from "zod";

export const shippingAddressSchema = z.object({
  details: z.string().trim().min(5, "Enter your street and building details."),
  phone: z.string().trim().regex(/^(002)?01[0-25]\d{8}$/, "Enter a valid Egyptian mobile number."),
  city: z.string().trim().min(2, "Enter your city."),
});

export const checkoutSchema = shippingAddressSchema;
export type CheckoutValues = z.infer<typeof checkoutSchema>;

export const cashOrderRequestSchema = z.object({
  cartId: z.string().trim().min(1),
  shippingAddress: shippingAddressSchema,
});

export const onlineCheckoutRequestSchema = z.object({
  cartId: z.string().trim().min(1),
  url: z.string().url(),
  shippingAddress: shippingAddressSchema,
});
