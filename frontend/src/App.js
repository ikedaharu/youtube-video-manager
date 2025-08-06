import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('videoLists');
    return savedLists ? JSON.parse(savedLists) : [];
  });
  const [selectedListId, setSelectedListId] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [videoUrls, setVideoUrls] = useState({});

  useEffect(() => {
    localStorage.setItem('videoLists', JSON.stringify(lists));
  }, [lists]);

  const handleVideoUrlChange = (listId, url) => {
    setVideoUrls(prev => ({ ...prev, [listId]: url }));
  };

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

  const addVideo = async (listId) => {
    const videoUrl = videoUrls[listId] || '';
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
      
      handleVideoUrlChange(listId, '');
    } catch (error) {
      console.error('Error fetching video info:', error);
      alert('動画情報の取得に失敗しました');
    }
  };

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

  const deleteList = (listId) => {
    setLists(lists.filter(list => list.id !== listId));
    if (selectedListId === listId) {
      setSelectedListId(null);
    }
  };

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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">youtube-video-manager (動画管理アプリ)</h1>
      
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="新しいリスト名"
          className="border border-gray-300 rounded-lg p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={createList}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          リストを作成
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {lists.map(list => (
            <div
              key={list.id}
              className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${
                selectedListId === list.id 
                  ? 'bg-blue-50 border-blue-500 shadow-lg' 
                  : 'bg-white hover:shadow-md'
              }`}
              onClick={() => setSelectedListId(list.id)}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">{list.name}</h2>
              <div className="mb-3">
                <input
                  type="text"
                  value={videoUrls[list.id] || ''}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleVideoUrlChange(list.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="YouTube URL"
                  className="border border-gray-300 rounded p-2 w-full mb-2"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addVideo(list.id);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  動画を追加
                </button>
              </div>
              <div className="flex flex-wrap justify-between items-center">
                <div className="space-x-2 mb-2 md:mb-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sortByDate(list.id, true);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    日付順↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sortByDate(list.id, false);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    日付順↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sortByChannel(list.id);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    チャンネル順
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  リストを削除
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          {selectedListId && (
            <div className="border rounded-lg p-4 bg-white shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {lists.find(l => l.id === selectedListId)?.name} の動画一覧
              </h2>
              <div className="space-y-3">
                {lists
                  .find(l => l.id === selectedListId)
                  ?.videos.map((video, index) => (
                    <div key={index} className="border rounded p-3 hover:shadow-sm transition duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <h3 className="font-bold text-gray-800">{video.title}</h3>
                          <p className="text-gray-600 text-sm">チャンネル: {video.channel_title}</p>
                          <p className="text-gray-500 text-sm">投稿日: {new Date(video.published_at).toLocaleDateString()}</p>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 text-sm inline-block mt-1"
                          >
                            動画を開く
                          </a>
                        </div>
                        <button
                          onClick={() => deleteVideo(selectedListId, index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs ml-2"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;