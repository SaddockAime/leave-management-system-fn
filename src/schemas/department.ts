import { z } from 'zod';

// Create Department Schema
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  managerId: z.string().uuid().optional().or(z.literal('')),
});

// Update Department Schema
export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name cannot exceed 100 characters')
    .optional(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  managerId: z.string().uuid().optional().or(z.literal('')),
});

// Type exports
export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;
