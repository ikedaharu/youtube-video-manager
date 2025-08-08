import React from 'react';
import { VideoCard } from './VideoCard';

export const VideoList = ({ videos, onDelete }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-16 border rounded-lg bg-white dark:bg-gray-900">
        まだ動画がありません。URLを入力して追加してください。
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} onDelete={() => onDelete(index)} />
      ))}
    </div>
  );
}; 