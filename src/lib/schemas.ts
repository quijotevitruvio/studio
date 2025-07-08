import { z } from "zod";

const phoneSchema = z.object({
  id: z.string().optional(),
  number: z.string().min(1, "El número de teléfono es obligatorio."),
  type: z.enum(["personal", "empresa"]).default("personal"),
  hasWhatsapp: z.boolean().default(false),
  observations: z.string().optional(),
});

const equipmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre del equipo es obligatorio."),
  username: z.string().optional(),
  password: z.string().optional(),
  serial: z.string().min(1, "El número de serie es obligatorio."),
  hasLicense: z.boolean().default(false),
  licenseSerial: z.string().optional(),
  observations: z.string().optional(),
});

const softwareSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre del software es obligatorio."),
  hasLicense: z.boolean().default(false),
  licenseSerial: z.string().optional(),
  observations: z.string().optional(),
});

const websiteSchema = z.object({
  id: z.string().optional(),
  url: z.string().url("URL inválida.").min(1, "La URL es obligatoria."),
  email: z.string().email("Email inválido.").min(1, "El email es obligatorio."),
  password: z.string().min(1, "La contraseña es obligatoria."),
  has2fa: z.boolean().default(false),
  recoveryEmail: z.string().email("Email de recuperación inválido.").optional().or(z.literal("")),
  observations: z.string().optional(),
});

export const assetAllySchema = z.object({
  companyName: z.string().min(1, "El nombre de la empresa es obligatorio."),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  jobTitle: z.string().min(2, "El puesto de trabajo debe tener al menos 2 caracteres."),
  contacts: z.array(phoneSchema).default([]),
  equipments: z.array(equipmentSchema).default([]),
  software: z.array(softwareSchema).default([]),
  websites: z.array(websiteSchema).default([]),
});

export type AssetAllyFormValues = z.infer<typeof assetAllySchema>;

export const passwordGeneratorSchema = z.object({
  length: z.number().min(8, "Debe ser de al menos 8").max(128, "Debe ser de como máximo 128").default(16),
  includeNumbers: z.boolean().default(true),
  includeSymbols: z.boolean().default(true),
});

export type PasswordGeneratorValues = z.infer<typeof passwordGeneratorSchema>;
