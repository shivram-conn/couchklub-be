import { z } from 'zod';

// Generic validation result type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// Generic validation function
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }
    
    return {
      success: false,
      errors: result.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ),
    };
  } catch (error) {
    return {
      success: false,
      errors: ['Validation failed due to unexpected error'],
    };
  }
}

// Middleware-style validation function for API routes
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): ValidationResult<T> => {
    return validateData(schema, data);
  };
}

// UUID validation helper
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Email validation helper
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Error formatting helper
export function formatValidationErrors(errors: z.ZodIssue[]): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  errors.forEach(error => {
    const field = error.path.join('.');
    if (!formatted[field]) {
      formatted[field] = [];
    }
    formatted[field].push(error.message);
  });
  
  return formatted;
}

// Response helper for API validation errors
export function createValidationErrorResponse(errors: string[]) {
  return {
    error: 'Validation failed',
    details: errors,
    timestamp: new Date().toISOString(),
  };
}
