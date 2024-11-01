import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('videoLists');
    return savedLists ? JSON.parse(savedLists) : [];
  });
  const [selectedListId, setSelectedListId] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // ローカルストレージへの保存
  useEffect(() => {
    localStorage.setItem('videoLists', JSON.stringify(lists));
  }, [lists]);

  
  // 新しいリストの作成
  const createList = () => {
    if (!newListName.trim()) return;
    const newList = {
      id: Date.now(),
      name: newListName,
      videos: []
    };
    setLists([...lists, newList]);
    setNewListName('');
  };

  // 動画の追加
  const addVideo = async (listId) => {
    if (!videoUrl.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:8000/api/video-info', null, {
        params: { video_url: videoUrl }
      });
      
      const videoInfo = response.data;
      
      setLists(lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            videos: [...list.videos, videoInfo]
          };
        }
        return list;
      }));
      
      setVideoUrl('');
    } catch (error) {
      console.error('Error fetching video info:', error);
      alert('動画情報の取得に失敗しました');
    }
  };

  // リスト内の動画を日付順にソート
  const sortByDate = (listId, ascending = true) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        const sortedVideos = [...list.videos].sort((a, b) => {
          const dateA = new Date(a.published_at);
          const dateB = new Date(b.published_at);
          return ascending ? dateA - dateB : dateB - dateA;
        });
        return { ...list, videos: sortedVideos };
      }
      return list;
    }));
  };

  // チャンネルごとにソート
  const sortByChannel = (listId) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        const sortedVideos = [...list.videos].sort((a, b) => 
          a.channel_title.localeCompare(b.channel_title)
        );
        return { ...list, videos: sortedVideos };
      }
      return list;
    }));
  };

  // リストの削除
  const deleteList = (listId) => {
    setLists(lists.filter(list => list.id !== listId));
    if (selectedListId === listId) {
      setSelectedListId(null);
    }
  };

  // 動画の削除
  const deleteVideo = (listId, videoIndex) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        const updatedVideos = list.videos.filter((_, index) => index !== videoIndex);
        return { ...list, videos: updatedVideos };
      }
      return list;
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">動画管理アプリ</h1>
      
      {/* リスト作成フォーム */}
      <div className="mb-4">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="新しいリスト名"
          className="border p-2 mr-2"
        />
        <button
          onClick={createList}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          リストを作成
        </button>
      </div>

      {/* リスト一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {lists.map(list => (
            <div
              key={list.id}
              className="border p-4 mb-4 cursor-pointer"
              onClick={() => setSelectedListId(list.id)}
            >
              <h2 className="text-xl font-bold">{list.name}</h2>
              <div className="mt-2">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube URL"
                  className="border p-2 mr-2"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addVideo(list.id);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  動画を追加
                </button>
              </div>
              <div className="mt-2 flex justify-between">
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sortByDate(list.id, true);
                    }}
                    className="bg-gray-500 text-white px-2 py-1 rounded mr-2"
                  >
                    日付順↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sortByDate(list.id, false);
                    }}
                    className="bg-gray-500 text-white px-2 py-1 rounded mr-2"
                  >
                    日付順↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sortByChannel(list.id);
                    }}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    チャンネル順
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  リストを削除
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 選択されたリストの動画一覧 */}
        <div>
          {selectedListId && (
            <div className="border p-4">
              <h2 className="text-xl font-bold mb-4">
                {lists.find(l => l.id === selectedListId)?.name} の動画一覧
              </h2>
              {lists
                .find(l => l.id === selectedListId)
                ?.videos.map((video, index) => (
                  <div key={index} className="border p-2 mb-2 flex justify-between">
                    <div>
                      <h3 className="font-bold">{video.title}</h3>
                      <p>チャンネル: {video.channel_title}</p>
                      <p>投稿日: {new Date(video.published_at).toLocaleDateString()}</p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        動画を開く
                      </a>
                    </div>
                    <button
                      onClick={() => deleteVideo(selectedListId, index)}
                      className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                    >
                      動画を削除
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;