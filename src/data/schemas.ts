import { z } from 'zod';

/**
 * Zod schemas for runtime validation of pokemon.json and types.json.
 *
 * These schemas ensure data integrity at build time and provide
 * clear error messages when data is malformed.
 */

// ── Type Chart Schema ──────────────────────────────────────────────

const TypeEffectivenessSchema = z.record(z.string(), z.number());

export const TypeChartSchema = z.record(z.string(), TypeEffectivenessSchema);

export type TypeChart = z.infer<typeof TypeChartSchema>;

// ── Pokemon Schema ─────────────────────────────────────────────────

const AbilitySchema = z.object({
  name: z.string().regex(/^[a-z0-9\s.'-]+$/),
  description: z.string().min(1),
});

export const PokemonSchema = z.object({
  id: z.number().int().positive().max(11000),
  name: z.string().min(1).regex(/^[A-Za-z][A-Za-z0-9\s.'()\-\u00C0-\u024F]*$/),
  types: z.array(z.string()).min(1).max(2),
  speed: z.number().int().positive().max(200),
  sprite: z.string().url().optional(),
  abilities: z.array(AbilitySchema).optional(),
});

export type Pokemon = z.infer<typeof PokemonSchema>;

// ── Full Pokemon Data Schema ───────────────────────────────────────

export const PokemonDataSchema = z.record(z.string(), PokemonSchema);

export type PokemonData = z.infer<typeof PokemonDataSchema>;

// ── Validation Helpers ─────────────────────────────────────────────

/**
 * Validates and parses pokemon data. Throws on invalid data.
 * Use at module load time to catch errors early.
 */
export function validatePokemonData(data: unknown): PokemonData {
  return PokemonDataSchema.parse(data);
}

/**
 * Validates and parses type chart data. Throws on invalid data.
 */
export function validateTypeChart(data: unknown): TypeChart {
  return TypeChartSchema.parse(data);
}

/**
 * Safe validation that returns errors instead of throwing.
 * Returns { success: true, data } or { success: false, errors }.
 */
export function tryValidatePokemonData(data: unknown) {
  const result = PokemonDataSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    };
  }
  return { success: true as const, data: result.data };
}
