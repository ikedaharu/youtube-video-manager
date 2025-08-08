import React from 'react';

export const ConfirmDialog = ({ open, title = '確認', message, confirmText = 'OK', cancelText = 'キャンセル', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-sm p-5">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">{cancelText}</button>
          <button onClick={onConfirm} className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 text-sm">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}; 