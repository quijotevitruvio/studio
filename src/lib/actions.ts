"use server";

import { suggestPassword, type SuggestPasswordInput } from "@/ai/flows/suggest-password";
import { passwordGeneratorSchema } from "@/lib/schemas";
import { z } from "zod";

export async function generatePasswordAction(input: SuggestPasswordInput) {
  try {
    const validatedInput = passwordGeneratorSchema.parse(input);
    const result = await suggestPassword(validatedInput);
    return { success: true, password: result.password };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Entrada inválida." };
    }
    console.error("Password generation failed:", error);
    return { success: false, error: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo." };
  }
}
