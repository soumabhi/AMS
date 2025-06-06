import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === 'success'
      ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
      : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400';
  const textColor = type === 'success' ? 'text-gray-800' : 'text-gray-900';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
      <div className={`max-w-sm w-full ${bgColor} border rounded-xl shadow-lg backdrop-blur-sm p-4`}>
        <div className="flex items-center">
          <Icon className="h-5 w-5 text-gray-700" />
          <div className="ml-3">
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-lg p-1.5 text-gray-400 hover:bg-white/50 focus:outline-none transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
