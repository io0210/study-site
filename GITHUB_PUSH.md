# GitHubへのプッシュ手順

## 初回のみ：Gitの設定

```powershell
cd C:\Users\motim\.cursor\study-site
git config --global user.email "あなたのメールアドレス"
git config --global user.name "あなたの名前"
```

## 初回のみ：GitHubリポジトリを作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」→「New repository」
3. リポジトリ名を入力（例：`study-site`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

## 初回のみ：Gitを初期化してプッシュ

```powershell
cd C:\Users\motim\.cursor\study-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/study-site.git
git push -u origin main
```

**重要**: `あなたのユーザー名` を実際のGitHubユーザー名に置き換えてください。

## 2回目以降：更新をプッシュ

```powershell
cd C:\Users\motim\.cursor\study-site
git add .
git commit -m "更新内容の説明"
git push
```

## よくあるエラーと対処法

### エラー: `remote origin already exists`
```powershell
git remote remove origin
git remote add origin https://github.com/あなたのユーザー名/study-site.git
```

### エラー: `Author identity unknown`
```powershell
git config --global user.email "あなたのメールアドレス"
git config --global user.name "あなたの名前"
```

### エラー: 認証エラー
GitHubのPersonal Access Tokenを使用する必要がある場合があります。





