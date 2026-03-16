import { z } from 'zod';

export const getUploadUrlSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
});

export const submitTicketSchema = z.object({
  type: z.enum(['Bug', 'Feature Request', 'Question']),
  subject: z.string().min(1).max(255),
  description: z.string().min(1),
  userEmail: z.string().email(),
  attachmentKeys: z.array(z.string()).max(5).optional(),
});

export type GetUploadUrlInput = z.infer<typeof getUploadUrlSchema>;
export type SubmitTicketInput = z.infer<typeof submitTicketSchema>;
