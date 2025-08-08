import React, { useState } from 'react';

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[^\s]+$/i;

export const AddVideoForm = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!YOUTUBE_URL_REGEX.test(trimmed)) {
      setError('YouTubeのURL形式ではありません');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd(trimmed);
      setUrl('');
    } catch (e) {
      // onAdd側でトースト等を表示
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-2">
        <div className="flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="YouTube URLを入力"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white text-sm ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >{loading ? '追加中…' : '動画を追加'}</button>
      </div>
    </div>
  );
}; 