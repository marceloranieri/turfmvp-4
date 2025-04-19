
import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  title: string;
  message: string;
  retry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ title, message, retry }) => {
  return (
    <div className="rounded-md bg-destructive/10 p-4 flex flex-col items-center justify-center text-center my-4">
      <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-muted-foreground mb-3">{message}</p>
      {retry && (
        <Button variant="outline" className="gap-2" onClick={retry}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SupabaseErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  fallback = <ErrorDisplay title="Something went wrong" message="An error occurred while fetching data" /> 
}) => {
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      if (event.error && event.error.name === 'SupabaseError') {
        setError(event.error);
        event.preventDefault();
      }
    };
    
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);
  
  if (error) {
    return (
      typeof fallback === 'function' 
      ? fallback(error, () => setError(null)) 
      : fallback
    );
  }
  
  return <>{children}</>;
};

export default SupabaseErrorBoundary;
