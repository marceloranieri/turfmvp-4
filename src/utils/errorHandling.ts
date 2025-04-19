
import { toast } from '@/hooks/use-toast';

export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export const handleSupabaseError = (error: any) => {
  console.error('Supabase operation failed:', error);
  
  // Common Supabase error codes
  if (error.code === 'PGRST301') {
    return new SupabaseError(
      'Database connection failed',
      'DB_CONNECTION_ERROR',
      error
    );
  }
  
  if (error.code === 'PGRST204') {
    return new SupabaseError(
      'No data found',
      'NO_DATA_ERROR',
      error
    );
  }
  
  if (error.code === '23505') {
    return new SupabaseError(
      'This record already exists',
      'DUPLICATE_ERROR',
      error
    );
  }
  
  if (error.code === '42501') {
    return new SupabaseError(
      'You don\'t have permission to perform this action',
      'PERMISSION_ERROR',
      error
    );
  }
  
  if (error.code === '23503') {
    return new SupabaseError(
      'Referenced record does not exist',
      'REFERENCE_ERROR',
      error
    );
  }
  
  // Generic error
  return new SupabaseError(
    error.message || 'An unexpected error occurred',
    error.code || 'UNKNOWN_ERROR',
    error
  );
};

export const withErrorHandling = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  errorMessages: {
    title: string;
    message: string;
  }
) => {
  try {
    const { data, error } = await operation();
    
    if (error) {
      const supabaseError = handleSupabaseError(error);
      
      // Show toast notification
      toast({
        title: errorMessages.title,
        description: errorMessages.message,
        variant: 'destructive',
      });
      
      throw supabaseError;
    }
    
    return data;
  } catch (error) {
    if (!(error instanceof SupabaseError)) {
      toast({
        title: errorMessages.title,
        description: errorMessages.message,
        variant: 'destructive',
      });
    }
    throw error;
  }
};

// Example usage:
// const sendMessage = async (content: string) => {
//   return withErrorHandling(
//     () => supabase.from('messages').insert({ content }).single(),
//     {
//       title: 'Failed to send message',
//       message: 'Your message could not be sent. Please try again.'
//     }
//   );
// };
