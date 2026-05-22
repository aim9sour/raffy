import { z } from "zod";

export const readingStatuses = ["UNREAD", "READING", "READ"] as const;

export const bookInputSchema = z.object({
  title: z.string().trim().min(1, "Book title is required"),
  author: z.string().trim().default(""),
  coverUrl: z.string().trim().url().or(z.literal("")).default(""),
  category: z
    .string()
    .trim()
    .optional()
    .default("Uncategorized")
    .transform((value) => value || "Uncategorized"),
  shelf: z
    .string()
    .trim()
    .optional()
    .default("General")
    .transform((value) => value || "General"),
  acquiredAt: z
    .string()
    .trim()
    .date()
    .nullable()
    .optional()
    .transform((value) => value || null),
  status: z.enum(readingStatuses).default("UNREAD"),
  rating: z
    .number()
    .int()
    .min(1)
    .max(5)
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  notes: z.string().trim().default(""),
});

export const partialBookInputSchema = bookInputSchema.partial();

export type ReadingStatus = (typeof readingStatuses)[number];
export type BookInput = z.infer<typeof bookInputSchema>;

export type LibraryBook = BookInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type BookFilters = {
  search?: string;
  category?: string;
  shelf?: string;
  status?: ReadingStatus | "ALL";
};
