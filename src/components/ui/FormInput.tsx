import { InputHTMLAttributes } from 'react';

interface ValidationError {
    message?: string;
    type?: string;
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: ValidationError | null;
    type?: string;
    autoComplete?: string;
}

export default function FormInput({
                                      label,
                                      id,
                                      error,
                                      type = "text",
                                      autoComplete,
                                      ...props
                                  }: FormInputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={id}
                type={type}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                autoComplete={autoComplete}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
        </div>
    );
}