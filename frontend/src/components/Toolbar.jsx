import React from 'react';

export const Toolbar = ({ searchQuery, onSearchChange, sortKey, onChangeSortKey, sortOrder, onToggleSortOrder }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="検索（タイトル/チャンネル）"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">並び替え</label>
        <select
          value={sortKey}
          onChange={(e) => onChangeSortKey(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
        >
          <option value="date">投稿日</option>
          <option value="channel">チャンネル</option>
        </select>
        <button
          onClick={onToggleSortOrder}
          className="px-3 py-2 rounded-lg border text-sm"
        >{sortOrder === 'asc' ? '昇順' : '降順'}</button>
      </div>
    </div>
  );
}; 