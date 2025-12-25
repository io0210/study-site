# GitHub & Vercel デプロイ手順

## 1. GitHubリポジトリの作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」→「New repository」
3. リポジトリ名を入力（例：`study-site`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

## 2. Gitの初期設定（初回のみ）

```powershell
cd C:\Users\motim\.cursor\study-site
git config --global user.email "あなたのメールアドレス"
git config --global user.name "あなたの名前"
```

## 3. GitHubにプッシュ

```powershell
cd C:\Users\motim\.cursor\study-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/study-site.git
git push -u origin main
```

**注意**: `あなたのユーザー名` を実際のGitHubユーザー名に置き換えてください。

## 4. Vercelでデプロイ

1. [Vercel](https://vercel.com) にアクセス
2. 「Sign Up」→「Continue with GitHub」でログイン
3. 「Add New...」→「Project」をクリック
4. 作成したリポジトリ（`study-site`）を選択
5. 「Import」をクリック
6. 設定を確認（自動設定でOK）：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. 「Deploy」をクリック
8. 数分待つとデプロイ完了
9. 表示されたURL（例：`https://study-site.vercel.app`）でアクセス可能

## 5. 今後の更新方法

コードを更新したら：

```powershell
git add .
git commit -m "更新内容の説明"
git push
```

Vercelが自動で再デプロイします。

## プッシュされるファイル

以下のファイルがGitHubにプッシュされます：

- `.gitignore`
- `index.html`
- `package.json`
- `package-lock.json`
- `README.md`
- `tsconfig.json`
- `vercel.json` ← **重要！**
- `vite.config.ts`
- `src/` フォルダ内の全ファイル

**プッシュされないファイル**（`.gitignore`で除外）：
- `node_modules/`（自動でインストールされる）
- `dist/`（ビルド時に生成される）

## トラブルシューティング

### Gitがインストールされていない場合
[Git for Windows](https://git-scm.com/download/win) をダウンロード・インストール

### プッシュできない場合
- GitHubの認証情報を確認
- Personal Access Tokenを使用する場合もある

### Vercelでビルドエラーが出る場合
- Vercelダッシュボードの「Deployments」タブでエラーログを確認

