# youtube-video-manager Frontend

本リポジトリは、YouTube動画をリストで収集・整理するフロントエンド（React + Tailwind CSS）です。将来的に他システムへ展開しても運用方針がぶれないよう、設定・規約・開発フローをここに集約します。

## 目的
- YouTube動画URLからメタ情報を取得し、複数のリストで管理
- 並び替え（投稿日昇降／チャンネル名）や検索／フィルタによる整理
- ローカル永続化（localStorage）と将来的なバックエンド連携

## 技術スタック
- React 18 (CRA)
- Tailwind CSS 3（`@tailwindcss/forms`）
- Axios

## 必要要件
- Node.js 18 以上
- npm 8 以上

## セットアップ
```bash
npm ci # もしくは npm install
npm start # http://localhost:3000
```

## 環境変数
- `REACT_APP_API_BASE_URL`（例: `http://localhost:8000`）
  - 今後、API呼び出しのベースURLに使用します。
  - `.env` をルート（`frontend/`）直下に配置してください。
  - 例は `.env.example` を参照。

APIベースURLは `REACT_APP_API_BASE_URL` に対応済みです（`src/lib/apiClient.js`）。

## ディレクトリ構成（抜粋）
```
frontend/
  ├─ public/
  ├─ src/
  │   ├─ App.js            # 画面の主要ロジック（暫定：分割予定）
  │   ├─ index.js
  │   ├─ index.css         # Tailwind エントリ
  │   └─ App.css           # CRA 既定スタイル（縮小・削除予定）
  ├─ docs/
  │   └─ UI_OVERVIEW.md    # UI概要設計（コンポーネント・ルーティング案）
  ├─ README.md
  └─ .env.example
```

## 実行・ビルド・テスト
```bash
npm start
npm run build
npm test
```

## コーディング規約（要点）
- 命名
  - 変数は名詞、関数は動詞句。省略語よりフルワードを優先。
  - コンポーネントはパスカルケース（例: `VideoCard`）。
- コンポーネント設計
  - 単一責務・疎結合を徹底。UIは `presentational`、ロジックは `container` に分離。
  - フォーム・モーダル・トーストなど横断UIは再利用コンポーネント化。
- スタイル
  - Tailwind ユーティリティを基本。繰り返しはクラス合成や抽象化で解消。
  - ダークモードは `dark:` バリアントで対応。
- アクセシビリティ
  - ラベル、ロール、フォーカスリング、キーボード操作を提供。
- コメント
  - 「なぜ」を中心に最小限。明快な命名で可読性を優先。

## UI デザイン方針（要点）
- レイアウト
  - 左：リストサイドバー、右：コンテンツ領域（動画一覧）。
  - 右上にツールバー（検索・並び替え・表示切替）。
- 表示
  - サムネイル付きカードを基本、情報量が多い場合はテーブル切替。
  - 空状態にはガイダンスと簡易イラスト。
- 操作性
  - 処理中はボタン disabled＋スピナー、成功/失敗はトーストで通知。
  - 削除は確認モーダルまたは Undo トースト。

## API 連携とエラーハンドリング（方針）
- `axios` のインスタンスを作成し、ベースURL・タイムアウト・共通エラーハンドリングを集中管理。
- ネットワークエラー／検証エラー／サーバーエラーでメッセージを出し分け。

## データ永続化（現状）
- `localStorage` キー: `videoLists`
- スキーマ（例）
```json
[
  {
    "id": 1700000000000,
    "name": "学習用",
    "videos": [
      {
        "title": "...",
        "channel_title": "...",
        "published_at": "2024-01-01T00:00:00Z",
        "url": "https://www.youtube.com/watch?v=..."
      }
    ]
  }
]
```

## ルーティング（導入予定）
- `/#/lists/:id` でリストを直接開けるようにします。
- 並び替え/検索パラメータはクエリで保持します。

## 変更フロー
1. `docs/UI_OVERVIEW.md` を更新（仕様の真実のソース）。
2. コンポーネント分割・UI実装。
3. 動作確認・テスト。
4. README の追従更新。

---
このREADMEはプロジェクトの運用と設計の土台です。他システムへ展開する場合も、この規約・方針を起点にしてください。
