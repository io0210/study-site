# Cloudflare Pages 完全ガイド

## Cloudflare Pagesとは

Cloudflare Pagesは、Cloudflareが提供する無料の静的サイトホスティングサービスです。GitHubと連携して自動デプロイが可能です。

## メリット

- ✅ **完全無料**（制限なし）
- ✅ **超高速**（CloudflareのCDNを使用）
- ✅ **自動デプロイ**（GitHubにプッシュするだけで自動更新）
- ✅ **カスタムドメイン対応**（無料）
- ✅ **HTTPS自動対応**
- ✅ **プレビュー機能**（プルリクエストごとにプレビューURL生成）
- ✅ **設定が簡単**

## デメリット

- ❌ 静的サイトのみ（サーバーサイドの処理は不可）
- ❌ ビルド時間に制限あり（無料版でも十分）

## アカウント作成

1. [Cloudflare Pages](https://pages.cloudflare.com) にアクセス
2. 「Sign up」をクリック
3. メールアドレスでアカウント作成（無料）

## デプロイ手順

### ステップ1: GitHubリポジトリを準備

まず、GitHubにコードをプッシュしておく必要があります。

```powershell
cd C:\Users\motim\.cursor\study-site
git add .
git commit -m "Cloudflare Pages用に準備"
git push
```

### ステップ2: Cloudflare Pagesでプロジェクトを作成

1. [Cloudflare Dashboard](https://dash.cloudflare.com) にログイン
2. 左メニューから **「Pages」** を選択
3. **「Create a project」** をクリック
4. **「Connect to Git」** を選択
5. GitHubアカウントを連携（初回のみ）
6. リポジトリ（`study-site`）を選択
7. **「Begin setup」** をクリック

### ステップ3: ビルド設定

以下の設定を入力：

- **Project name**: `study-site`（好きな名前）
- **Production branch**: `main`（デフォルト）
- **Framework preset**: `Vite`（自動で認識される場合もある）
- **Build command**: `npm run build`
- **Build output directory**: `dist`

**重要**: Framework presetが自動で認識されない場合は、手動で「Vite」を選択してください。

### ステップ4: 環境変数（通常は不要）

通常は環境変数の設定は不要です。必要に応じて追加できます。

### ステップ5: デプロイ開始

1. **「Save and Deploy」** をクリック
2. 数分待つとデプロイが完了
3. デプロイが完了すると、URLが表示されます：
   - 例：`https://study-site.pages.dev`

## 自動デプロイ

GitHubにプッシュするだけで、自動で再デプロイされます：

```powershell
git add .
git commit -m "更新内容"
git push
```

数分後、自動でサイトが更新されます。

## カスタムドメインの設定

### 1. ドメインを追加

1. Cloudflare Pagesのプロジェクトページを開く
2. **「Custom domains」** タブをクリック
3. **「Set up a custom domain」** をクリック
4. ドメイン名を入力（例：`study.yourdomain.com`）

### 2. DNS設定

ドメインのDNS設定で、Cloudflareが指定するCNAMEレコードを追加します。

## プレビュー機能

プルリクエストを作成すると、自動でプレビューURLが生成されます：

1. GitHubでプルリクエストを作成
2. Cloudflare Pagesが自動でプレビューをビルド
3. プルリクエストにコメントとしてプレビューURLが追加される

## ビルドログの確認

1. Cloudflare Pagesのプロジェクトページを開く
2. **「Deployments」** タブをクリック
3. デプロイをクリックしてログを確認

## よくある問題と解決方法

### 問題: ビルドエラー

**解決方法**:
1. ビルドログを確認
2. `package.json`の`build`スクリプトを確認
3. `vite`が`dependencies`にあるか確認

### 問題: サイトが表示されない

**解決方法**:
1. ビルドが成功しているか確認
2. `dist`フォルダにファイルが生成されているか確認
3. `vercel.json`の`rewrites`設定を確認（Cloudflare Pagesでは不要な場合がある）

### 問題: 404エラー

**解決方法**:
Cloudflare Pagesは自動でSPAのルーティングを処理しますが、必要に応じて`_redirects`ファイルを作成：

`public/_redirects`:
```
/*    /index.html   200
```

## Vercelとの違い

| 項目 | Cloudflare Pages | Vercel |
|------|------------------|--------|
| 無料枠 | 制限なし | 制限あり |
| 速度 | 超高速（CDN） | 高速 |
| 設定 | 簡単 | やや複雑 |
| プレビュー | あり | あり |

## 実際の使用例

```powershell
# 1. コードを更新
# （App.tsxなどを編集）

# 2. GitHubにプッシュ
cd C:\Users\motim\.cursor\study-site
git add .
git commit -m "機能を追加"
git push

# 3. 数分待つと自動でデプロイ完了
# https://study-site.pages.dev で確認
```

## まとめ

Cloudflare Pagesは、**最も簡単で高速なデプロイ方法**の一つです。

- ✅ 完全無料
- ✅ 超高速
- ✅ 自動デプロイ
- ✅ 設定が簡単
- ✅ Vercelよりエラーが出にくい

Vercelでエラーが出る場合は、Cloudflare Pagesを試してみてください！



