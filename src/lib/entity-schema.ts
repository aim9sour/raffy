import { z } from "zod";

export const entityTypes = ["AUTHOR", "CATEGORY", "SHELF"] as const;

export const entityInputSchema = z.object({
  type: z.enum(entityTypes),
  name: z.string().trim().min(1, "Name is required"),
});

export type EntityType = (typeof entityTypes)[number];
export type EntityInput = z.infer<typeof entityInputSchema>;
