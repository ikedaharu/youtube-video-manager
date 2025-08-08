import React, { useState } from 'react';

export const ListSidebar = ({ lists, selectedListId, onSelectList, onCreateList, onDeleteList }) => {
  const [newListName, setNewListName] = useState('');

  const handleCreate = () => {
    const name = newListName.trim();
    if (!name) return;
    onCreateList(name);
    setNewListName('');
  };

  return (
    <aside className="w-full md:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 md:h-[calc(100vh-4rem)] md:sticky md:top-16">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">リスト</h2>
      </div>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="新しいリスト名"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleCreate} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">作成</button>
        </div>
      </div>

      <ul className="space-y-2">
        {lists.map((list) => (
          <li key={list.id}>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                selectedListId === list.id
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-200 hover:shadow-sm'
              }`}
              onClick={() => onSelectList(list.id)}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{list.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteList(list.id);
                  }}
                  className="text-red-600 hover:text-red-700 text-xs"
                >削除</button>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}; 