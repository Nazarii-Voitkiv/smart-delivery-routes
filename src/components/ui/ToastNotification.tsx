import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  duration?: number;
}

export default function ToastNotification({ message, type, duration = 3000 }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  let icon;
  let bgColor;
  let textColor;

  switch (type) {
    case 'success':
      icon = <CheckCircleIcon className="h-6 w-6" />;
      bgColor = 'bg-green-50';
      textColor = 'text-green-800';
      break;
    case 'error':
      icon = <XCircleIcon className="h-6 w-6" />;
      bgColor = 'bg-red-50';
      textColor = 'text-red-800';
      break;
    case 'warning':
      icon = <ExclamationCircleIcon className="h-6 w-6" />;
      bgColor = 'bg-yellow-50';
      textColor = 'text-yellow-800';
      break;
    default:
      icon = <CheckCircleIcon className="h-6 w-6" />;
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-800';
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className={`rounded-lg shadow-lg p-4 ${bgColor}`}>
        <div className="flex">
          <div className={`flex-shrink-0 ${textColor}`}>
            {icon}
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-${type}-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type}-500`}
              >
                <span className="sr-only">Zamknij</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
