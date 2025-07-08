'use server';

/**
 * @fileOverview An AI agent that suggests secure passwords based on user-defined criteria.
 *
 * - suggestPassword - A function that generates a password suggestion.
 * - SuggestPasswordInput - The input type for the suggestPassword function.
 * - SuggestPasswordOutput - The return type for the suggestPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPasswordInputSchema = z.object({
  length: z
    .number()
    .describe('The desired length of the password.')
    .default(16),
  includeNumbers: z
    .boolean()
    .describe('Whether to include numbers in the password.')
    .default(true),
  includeSymbols: z
    .boolean()
    .describe('Whether to include symbols in the password.')
    .default(true),
});
export type SuggestPasswordInput = z.infer<typeof SuggestPasswordInputSchema>;

const SuggestPasswordOutputSchema = z.object({
  password: z.string().describe('The generated password.'),
});
export type SuggestPasswordOutput = z.infer<typeof SuggestPasswordOutputSchema>;

export async function suggestPassword(input: SuggestPasswordInput): Promise<SuggestPasswordOutput> {
  return suggestPasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPasswordPrompt',
  input: {schema: SuggestPasswordInputSchema},
  output: {schema: SuggestPasswordOutputSchema},
  prompt: `You are a password generator AI. Generate a strong and unique password based on the following criteria:

Length: {{length}}
Include numbers: {{includeNumbers}}
Include symbols: {{includeSymbols}}

Ensure the password is complex and difficult to guess.
`,
});

const suggestPasswordFlow = ai.defineFlow(
  {
    name: 'suggestPasswordFlow',
    inputSchema: SuggestPasswordInputSchema,
    outputSchema: SuggestPasswordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
