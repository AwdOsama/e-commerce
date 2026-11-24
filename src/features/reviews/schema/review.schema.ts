import * as z from "zod";

export const reviewSchema = z.object({
  review: z.string().trim().min(3, "Write at least 3 characters.").max(1000, "Review must be 1000 characters or less."),
  rating: z.number().int().min(1, "Choose a star rating.").max(5, "Rating must be between 1 and 5."),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
