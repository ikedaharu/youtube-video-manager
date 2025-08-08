import React from 'react';

export const VideoCard = ({ video, onDelete }) => {
  return (
    <div className="border rounded p-3 hover:shadow-sm transition duration-200 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">{video.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">チャンネル: {video.channel_title}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">投稿日: {new Date(video.published_at).toLocaleDateString()}</p>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm inline-block mt-1"
          >動画を開く</a>
        </div>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs ml-2"
        >削除</button>
      </div>
    </div>
  );
}; 