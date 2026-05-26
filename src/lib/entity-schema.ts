import { z } from "zod";

export const entityTypes = ["AUTHOR", "CATEGORY", "SHELF"] as const;

const rawEntityInputSchema = z.object({
  type: z.enum(entityTypes),
  name: z.string().trim().min(1, "Name is required"),
  category: z.string().trim().nullable().optional(),
});

export const entityInputSchema = rawEntityInputSchema
  .superRefine((value, context) => {
    if (value.type === "SHELF" && !value.category) {
      context.addIssue({
        code: "custom",
        path: ["category"],
        message: "Shelf category is required",
      });
    }
  })
  .transform((value) => ({
    ...value,
    category: value.type === "SHELF" ? value.category ?? "" : null,
  }));

export const entityUpdateSchema = rawEntityInputSchema.partial();

export type EntityType = (typeof entityTypes)[number];
export type EntityInput = z.infer<typeof entityInputSchema>;
export type EntityUpdate = z.infer<typeof entityUpdateSchema>;
