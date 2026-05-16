import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().trim().min(2, 'Nom trop court').max(100),
  email: z.string().trim().toLowerCase().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit faire au moins 8 caractères')
    .max(200)
    .regex(/[A-Za-z]/, 'Doit contenir au moins une lettre')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
});

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis').max(200),
});

export const ClientCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().optional().or(z.literal('')),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  address: z.string().trim().max(500).optional().or(z.literal('')),
});

export const ClientUpdateSchema = ClientCreateSchema.extend({
  id: z.number().int().positive(),
});

export const UserApprovalSchema = z.object({
  status: z.literal('approved'),
});

export const RequestStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'completed']),
});

export const PaymentCreateSchema = z.object({
  projectId: z.number().int().positive(),
  amount: z.number().positive().max(1_000_000),
});

export const ReviewSubmitSchema = z.object({
  name: z.string().trim().min(2, 'Nom trop court').max(80),
  rating: z.number().int().min(1, 'Note de 1 à 5').max(5),
  comment: z.string().trim().min(10, 'Merci d\'écrire au moins 10 caractères').max(2000),
});

export const ProjectUpdateSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  status: z.enum(['planning', 'in_progress', 'completed']),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  internal_notes: z.string().trim().max(5000).optional().or(z.literal('')),
});

export function formatZodError(err: z.ZodError): string {
  return err.issues[0]?.message ?? 'Données invalides';
}
