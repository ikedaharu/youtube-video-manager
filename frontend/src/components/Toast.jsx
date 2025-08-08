import React from 'react';

export const Toast = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}>
          <div className="flex items-center">
            <span className="mr-3 text-sm">{t.message}</span>
            <button onClick={() => onDismiss(t.id)} className="text-white/80 hover:text-white text-xs">閉じる</button>
          </div>
        </div>
      ))}
    </div>
  );
}; 