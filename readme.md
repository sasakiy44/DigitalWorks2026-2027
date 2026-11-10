# DigitalWorks2026-2027

学生が **Cloudflare Pages** と **GitHub** を連携して公開した作品を、GitHub API を介して全自動で一元収集・表示するギャラリーポータルサイトです。

学生側の作業（Topic設定）と本ポータル側の自動ビルド（GitHub Actions + Cloudflare Deploy Hook）により、運用コストゼロで最新の作品集を維持できます。

---

## 🎨 システム概要図

```text
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │  【学生の作業】                                                             │
 │                                                                             │
 │ ┌─────────────────────────┐   ① 自動デプロイ   ┌──────────────────────────┐ │
 │ │    学生のGitHub         ├───────────────────►│  学生個人のCloudflare    │ │
 │ │   リポジトリ            │                    │  Pages (作品サイト)      │ │
 │ │  (Topic: class-2026)    │                    │ (https://xxx.pages.dev)  │ │
 │ └────────────┬────────────┘                    └─────────────┬────────────┘ │
 └──────────────┼───────────────────────────────────────────────┼──────────────┘
                │                                               │
                │ ② APIでリポジトリ情報                         │ ④ サイト画面の
                │    (名前/説明/URL) を収集                     │    キャプチャ生成
                ▼                                               ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │  【ポータルサイト（自動更新）】                                             │
 │                                                                             │
 │ ┌─────────────────────────┐                    ┌──────────────────────────┐ │
 │ │   ポータル用GitHub      │   ③ 自動ビルド     │  ポータルのCloudflare    │ │
 │ │   リポジトリ            ├───────────────────►│  学生作品ギャラリー       ├─► 🌐 閲覧者
 │ │  (Astro + GitHub API)   │                    │ (優秀作品 / 一般作品)    │
 │ └────────────▲────────────┘                    └──────────────────────────┘
 │              │                                                              
 │              └─ (GitHub Actions が毎日0時に Deploy Hook を叩いて再ビルド)   
 └─────────────────────────────────────────────────────────────────────────────┘

```

---

## 🛠 採用技術 (Tech Stack)

* **Framework**: [Astro](https://astro.build/) (SSG)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/)
* **API Integration**: GitHub REST API (Repository Search)
* **Thumbnail Generation**: [Microlink API](https://microlink.io/)
* **Automation**: GitHub Actions (Scheduled Deploy Hook)

---

## 🏷 作品の分類・自動集計ルール

ポータル構築時（ビルド時）に GitHub API を検索し、付与されている **Topic** に応じてカードを自動分割して掲載します。

| 分類 | 指定 Topic | 表示位置 |
| --- | --- | --- |
| **全作品** | `class-2026` | 「ALL PROJECTS」セクションに表示 |
| **優秀作品（ピックアップ）** | `featured-2026` | ページ最上部の「FEATURED WORKS」セクションに強調表示 |

---

## 🚀 ポータル運営者向けセットアップ手順

### 1. 環境変数の設定 (GitHub Token)

GitHub API のレート制限（未認証: 60回/時 ➔ 認証済: 5,000回/時）を回避するため、GitHub の Personal Access Token (PAT) を設定します。

1. GitHub の `Settings > Developer Settings > Personal access tokens` から Fine-grained token または Tokens (classic) を発行します。
2. Cloudflare Pages のプロジェクト設定（`Settings > Environment variables`）に追加します：
* `GITHUB_TOKEN`: 発行した Personal Access Token



### 2. 定期再ビルド設定 (GitHub Actions)

1. Cloudflare Pages の `Settings > Builds & deployments > Deploy hooks` から Webhook URL を生成します。
2. 本リポジトリの `Settings > Secrets and variables > Actions` に以下を登録します：
* Name: `CLOUDFLARE_DEPLOY_HOOK`
* Value: 生成した Deploy Hook URL


3. 毎日深夜0時（JST）に `.github/workflows/rebuild.yml` が自動実行され、最新の作品情報に更新されます。

---

## 👨‍💻 ローカル開発手順

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動 (http://localhost:4321)
npm run dev

# 本番ビルドの動作確認
npm run build
npm run preview

```

---

## 📖 学生向け設定手順（概要）

学生は自身の成果物リポジトリで以下の設定を行います：

1. **Cloudflare Pages** にリポジトリを連携して Web サイトをデプロイする。
2. リポジトリの **About (⚙️アイコン)** 設定で以下を入力する：
* **Website**: デプロイされた Cloudflare Pages の URL (`[https://xxxx.pages.dev](https://xxxx.pages.dev)`)
* **Description**: 作品の簡単な説明・キャッチコピー
* **Topics**: `class-2026` （※優秀作品に選定された場合は `featured-2026` も追加）