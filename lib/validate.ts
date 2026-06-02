import { ZodSchema } from 'zod';
import { apiError, ERROR_CODES } from './api-response';

export async function validateBody<T>(request: Request, schema: ZodSchema<T>) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const formattedErrors = result.error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return apiError(ERROR_CODES.VALIDATION_ERROR, formattedErrors, 400);
    }
    
    return result.data;
  } catch (error) {
    return apiError(ERROR_CODES.VALIDATION_ERROR, 'Invalid JSON body', 400);
  }
}
