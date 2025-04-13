import React, { InputHTMLAttributes, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    label, 
    error, 
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className="space-y-1">
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          className={`
            mt-1 block w-full px-3 py-2 border 
            ${error ? 'border-red-500' : 'border-gray-300'} 
            rounded-md shadow-sm 
            focus:outline-none focus:ring-blue-500 focus:border-blue-500
          `}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
