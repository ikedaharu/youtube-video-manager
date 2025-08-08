# UI 概要設計（youtube-video-manager）

本ドキュメントはUIの構成・コンポーネント分割・ルーティング・状態管理方針を示します。変更があれば本書を最優先で更新します。

## 1. 画面構成
- ヘッダー（アプリ名、テーマ切替）
- 左サイドバー：リスト一覧／新規作成
- 右コンテンツ：
  - ツールバー（検索、並び替え、表示切替、インポート/エクスポート）
  - 動画一覧（カード/テーブル切替）
  - 空状態表示

## 2. ルーティング
- `/#/lists/:listId`
  - ディープリンクで対象リストに直接遷移
- クエリパラメータ（例）
  - `?q=keyword`（検索）
  - `?sort=date|channel`（キー）
  - `&order=asc|desc`（昇降）
  - `&view=card|table`（表示）

## 3. コンポーネント分割
- Layout
  - `AppLayout`（ヘッダー＋サイドバー＋コンテンツ）
- サイドバー
  - `ListSidebar`（リスト一覧、選択、作成）
  - `ListItem`（1行）
- コンテンツ
  - `Toolbar`（検索、並び替えトグル、表示切替、Import/Export）
  - `AddVideoForm`（URL入力、バリデーション、追加）
  - `VideoList`（カード/テーブルビュー切替）
  - `VideoCard`（サムネ、タイトル、チャンネル、投稿日、操作）
- 共通
  - `Toast`（通知）
  - `ConfirmDialog`（削除等の確認）
  - `SpinnerButton`（ローディング付きボタン）

## 4. 状態管理
- ローカル状態（ページ内）
  - フォーム入力、ローディング、ソート/検索条件
- 永続化
  - `localStorage`: `videoLists`（既存）
  - `selectedListId` とビュー設定は `localStorage` とURLに保存
- 将来の拡張
  - Context もしくは軽量のZustand/Reduxを導入（規模拡大時）

## 5. データモデル
```ts
// List
{
  id: number;
  name: string;
  videos: Video[];
}

// Video
{
  title: string;
  channel_title: string;
  published_at: string; // ISO8601
  url: string;
  thumbnail_url?: string; // 取得予定
}
```

## 6. 挙動仕様（抜粋）
- 追加
  - URL形式と重複を事前検証
  - 追加中はフォーム無効化＋スピナー表示
  - 成功/失敗をトースト表示
- 並び替え
  - 1ボタンで昇降切替
  - 条件はURLクエリと `localStorage` に保存
- 削除
  - 確認ダイアログ or Undoトースト
- 検索/フィルタ
  - タイトル/チャンネル/投稿日（範囲）
- 表示切替
  - カード/テーブルを記憶

## 7. スタイル/テーマ
- Tailwindテーマ拡張
  - プライマリ/アクセントカラー、余白スケール、角丸
- ダークモード
  - `media` ではなく `class` 切替。ユーザー選択を保存

## 8. アクセシビリティ
- フォーカスインジケータ、ラベル関連付け、ARIAロール
- キーボード操作（Enterで追加、矢印で選択移動）

## 9. 実装ロードマップ
1. コンポーネント分割（Sidebar/Toolbar/AddVideoForm/VideoList）
2. トースト・確認ダイアログ導入（`alert`撤廃）
3. ルーティング導入（listIdと条件のURL保持）
4. APIベースURLを環境変数化
5. サムネイル取得・カード強化
6. 検索/フィルタ・ビュー切替
7. DnDで並べ替え強化
