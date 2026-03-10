import { z } from 'zod';

export const FactorSchema = z.object({
    id: z.number(),
    positiveVariant: z.string(),
    negativeVariant: z.string(),
});
export type Factor = z.infer<typeof FactorSchema>;

export const MetricSchema = z.object({
    id: z.number(),
    name: z.string(),
    higherIsBetter: z.boolean(),
});
export type Metric = z.infer<typeof MetricSchema>;

export const CreateFactorInputSchema = z.object({
    positiveVariant: z.string(),
    negativeVariant: z.string(),
});
export type CreateFactorInput = z.infer<typeof CreateFactorInputSchema>;

export const UpdateFactorInputSchema = z.object({
    positiveVariant: z.string().optional(),
    negativeVariant: z.string().optional(),
});
export type UpdateFactorInput = z.infer<typeof UpdateFactorInputSchema>;

export const CreateMetricInputSchema = z.object({
    name: z.string(),
    higherIsBetter: z.boolean(),
});
export type CreateMetricInput = z.infer<typeof CreateMetricInputSchema>;

export const UpdateMetricInputSchema = z.object({
    name: z.string().optional(),
    higherIsBetter: z.boolean().optional(),
});
export type UpdateMetricInput = z.infer<typeof UpdateMetricInputSchema>;
