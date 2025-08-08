import React, { useEffect, useMemo, useState } from 'react';
import { apiClient } from './lib/apiClient';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ListSidebar } from './components/ListSidebar';
import { AddVideoForm } from './components/AddVideoForm';
import { Toolbar } from './components/Toolbar';
import { VideoList } from './components/VideoList';
import { Toast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';

const App = () => {
  const [lists, setLists] = useLocalStorage('videoLists', []);
  const [selectedListId, setSelectedListId] = useLocalStorage('selectedListId', null);

  const [searchQuery, setSearchQuery] = useLocalStorage('searchQuery', '');
  const [sortKey, setSortKey] = useLocalStorage('sortKey', 'date'); // 'date' | 'channel'
  const [sortOrder, setSortOrder] = useLocalStorage('sortOrder', 'desc'); // 'asc' | 'desc'

  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, message: '', onConfirm: null, onCancel: null });

  const selectedList = useMemo(() => lists.find((l) => l.id === selectedListId) || null, [lists, selectedListId]);

  const addToast = (message, type = 'info', durationMs = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);
    if (durationMs > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, durationMs);
    }
  };

  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const onCreateList = (name) => {
    const newList = { id: Date.now(), name, videos: [] };
    setLists([...lists, newList]);
    setSelectedListId(newList.id);
    addToast('リストを作成しました');
  };

  const onDeleteList = (listId) => {
    const list = lists.find((l) => l.id === listId);
    setConfirm({
      open: true,
      message: `リスト「${list?.name || ''}」を削除しますか？この操作は元に戻せません。`,
      onConfirm: () => {
        setLists(lists.filter((l) => l.id !== listId));
        if (selectedListId === listId) setSelectedListId(null);
        setConfirm({ open: false, message: '', onConfirm: null, onCancel: null });
        addToast('リストを削除しました');
      },
      onCancel: () => setConfirm({ open: false, message: '', onConfirm: null, onCancel: null })
    });
  };

  const handleAddVideo = async (url) => {
    if (!selectedListId) {
      addToast('リストを選択してください', 'error');
      return;
    }
    try {
      const response = await apiClient.post('/api/video-info', null, { params: { video_url: url } });
      const videoInfo = response.data;

      setLists(
        lists.map((list) =>
          list.id === selectedListId
            ? { ...list, videos: [...list.videos, videoInfo] }
            : list
        )
      );
      addToast('動画を追加しました');
    } catch (error) {
      console.error('Error fetching video info:', error);
      addToast('動画情報の取得に失敗しました', 'error');
      throw error; // AddVideoForm側の状態復帰のため
    }
  };

  const requestDeleteVideo = (index) => {
    const video = selectedList?.videos[index];
    setConfirm({
      open: true,
      message: `「${video?.title || '動画'}」を削除しますか？`,
      onConfirm: () => {
        setLists(
          lists.map((list) =>
            list.id === selectedListId
              ? { ...list, videos: list.videos.filter((_, i) => i !== index) }
              : list
          )
        );
        setConfirm({ open: false, message: '', onConfirm: null, onCancel: null });
        addToast('動画を削除しました');
      },
      onCancel: () => setConfirm({ open: false, message: '', onConfirm: null, onCancel: null })
    });
  };

  const sortedVideos = useMemo(() => {
    if (!selectedList) return [];
    const videos = [...selectedList.videos];
    if (sortKey === 'date') {
      videos.sort((a, b) => {
        const dateA = new Date(a.published_at).getTime();
        const dateB = new Date(b.published_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (sortKey === 'channel') {
      videos.sort((a, b) => a.channel_title.localeCompare(b.channel_title));
      if (sortOrder === 'desc') videos.reverse();
    }
    return videos;
  }, [selectedList, sortKey, sortOrder]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return sortedVideos;
    const q = searchQuery.toLowerCase();
    return sortedVideos.filter(
      (v) => v.title.toLowerCase().includes(q) || v.channel_title.toLowerCase().includes(q)
    );
  }, [sortedVideos, searchQuery]);

  const onToggleSortOrder = () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

  useEffect(() => {
    // 初回マウント時、リストが存在し選択がない場合は先頭を選択
    if (!selectedListId && lists.length > 0) {
      setSelectedListId(lists[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">youtube-video-manager （動画管理アプリ）</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-6">
        <div>
          <ListSidebar
            lists={lists}
            selectedListId={selectedListId}
            onSelectList={setSelectedListId}
            onCreateList={onCreateList}
            onDeleteList={onDeleteList}
          />
        </div>

        <div className="space-y-4">
          {selectedList ? (
            <>
              <Toolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortKey={sortKey}
                onChangeSortKey={setSortKey}
                sortOrder={sortOrder}
                onToggleSortOrder={onToggleSortOrder}
              />

              <AddVideoForm onAdd={handleAddVideo} />

              <section className="border rounded-lg p-4 bg-white">
                <h2 className="text-lg font-semibold mb-3">{selectedList.name} の動画一覧</h2>
                <VideoList videos={filteredVideos} onDelete={requestDeleteVideo} />
              </section>
            </>
          ) : (
            <div className="text-center text-gray-500 py-24 border rounded-lg bg-white">
              左のサイドバーからリストを作成・選択してください。
            </div>
          )}
        </div>
      </main>

      <Toast toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog
        open={confirm.open}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
      />
    </div>
  );
};

export default App;