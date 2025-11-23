import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function NotificationToast({
  isOpen,
  type = 'success',
  message,
  onClose,
  duration = 3000
}) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${
        isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      } border rounded-lg shadow-lg p-4 max-w-md flex items-start space-x-3`}>
        <div className={`flex-shrink-0 w-6 h-6 ${
          isSuccess ? 'text-green-600' : 'text-red-600'
        }`}>
          {isSuccess ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1">
          <p className={`text-sm font-medium ${
            isSuccess ? 'text-green-900' : 'text-red-900'
          }`}>
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className={`flex-shrink-0 ${
            isSuccess ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'
          } transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
