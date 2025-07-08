import { z } from "zod";

const phoneSchema = z.object({
  id: z.string().optional(),
  number: z.string().min(1, "Phone number is required."),
  hasWhatsapp: z.boolean().default(false),
});

const equipmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Equipment name is required."),
  serial: z.string().min(1, "Serial number is required."),
  hasLicense: z.boolean().default(false),
});

const softwareSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Software name is required."),
});

const websiteSchema = z.object({
  id: z.string().optional(),
  url: z.string().url("Invalid URL.").min(1, "URL is required."),
  email: z.string().email("Invalid email.").min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
  has2fa: z.boolean().default(false),
  recoveryEmail: z.string().email("Invalid recovery email.").optional().or(z.literal("")),
});

export const assetAllySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters."),
  contacts: z.array(phoneSchema).default([]),
  equipments: z.array(equipmentSchema).default([]),
  software: z.array(softwareSchema).default([]),
  websites: z.array(websiteSchema).default([]),
});

export type AssetAllyFormValues = z.infer<typeof assetAllySchema>;

export const passwordGeneratorSchema = z.object({
  length: z.number().min(8, "Must be at least 8").max(128, "Must be at most 128").default(16),
  includeNumbers: z.boolean().default(true),
  includeSymbols: z.boolean().default(true),
});

export type PasswordGeneratorValues = z.infer<typeof passwordGeneratorSchema>;
