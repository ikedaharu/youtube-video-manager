# youtube-video-manager

シンプルで使いやすいYouTube動画管理アプリケーション。  
複数のプレイリストを作成し、お気に入りの動画を整理して保存できます。

## 機能

- 複数のプレイリストの作成・管理
- YouTube URLから動画情報を自動取得
- 動画の並び替え機能（投稿日時、チャンネル名）
- ローカルストレージを利用したデータ永続化
- レスポンシブデザイン対応

## 技術スタック

### フロントエンド
- React
- Axios
- Tailwind CSS

### バックエンド

- FastAPI
- httpx
- Pydantic

## 必要要件

- Node.js (v14以上)
- Python (v3.8以上)
- YouTube Data API キー

## インストール

1.リポジトリのクローン:
```
git clone [リポジトリURL]
cd youtube-playlist-manager
```

2.フロントエンドのセットアップ:
```
cd frontend
npm install
```

3.バックエンドのセットアップ:
```
cd backend
pip install -r requirements.txt
```

4.環境変数の設定:

バックエンドディレクトリに.envファイルを作成
以下の内容を追加:

```
YOUTUBE_API_KEY=あなたのYouTube API キー
```

## 使い方

1.バックエンドの起動:
```
cd backend
uvicorn main:app --reload

```

2.フロントエンドの起動:
```
cd frontend
npm start
```

ブラウザで http://localhost:3000 にアクセス

## 基本的な操作

1.「新しいリスト名」に名前を入力してリストを作成  
2.作成したリストにYouTube URLを入力して動画を追加  
3.各リストの動画を日付順やチャンネル順に並び替え可能  
4.不要なリストや動画は削除ボタンで簡単に削除可能  

## ライセンス
MIT

## 作者  
[@ikedaharu](https://github.com/ikedaharu)
