# ngrok 完全ガイド

## ngrokとは

ngrokは、ローカルサーバーをインターネット経由でアクセスできるようにするトンネルサービスです。

## インストール

### 方法1: npmでインストール（簡単）

```powershell
npm install -g ngrok
```

### 方法2: 公式サイトからダウンロード

1. [ngrok公式サイト](https://ngrok.com) にアクセス
2. 「Sign up」でアカウント作成（無料）
3. ダウンロードしてインストール

## 使い方

### ステップ1: 開発サーバーを起動

Cursorのターミナルで：

```powershell
cd C:\Users\motim\.cursor\study-site
npm run dev
```

サーバーが起動したら、`http://localhost:5173` でアクセスできることを確認。

### ステップ2: ngrokを起動

**別のターミナル**（新しいPowerShellウィンドウ）を開いて：

```powershell
ngrok http 5173
```

### ステップ3: URLを確認

ngrokを起動すると、以下のような表示が出ます：

```
Forwarding    https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:5173
```

この `https://xxxx-xx-xx-xx-xx.ngrok-free.app` が、インターネット経由でアクセスできるURLです。

### ステップ4: 他のデバイスでアクセス

スマホやタブレットから、ngrokで表示されたURLを開く：
- 例：`https://xxxx-xx-xx-xx-xx.ngrok-free.app`

## 注意点

### 無料版の制限

- **URLが毎回変わる**: ngrokを起動するたびに新しいURLが生成されます
- **セッション時間制限**: 長時間使っているとセッションが切れる場合があります
- **警告ページ**: 初回アクセス時にngrokの警告ページが表示されます（「Visit Site」をクリック）

### 有料版

- 固定URLが使える
- カスタムドメインが使える
- セッション時間制限なし

## トラブルシューティング

### エラー: `ngrok: command not found`

→ ngrokがインストールされていません。上記のインストール手順を実行してください。

### エラー: 認証が必要

→ ngrokのアカウントを作成して、認証トークンを設定する必要があります：

```powershell
ngrok config add-authtoken あなたのトークン
```

（トークンはngrokのダッシュボードから取得）

### 警告ページが表示される

→ 初回アクセス時にngrokの警告ページが表示されます。「Visit Site」ボタンをクリックしてください。

## 実際の使用例

```powershell
# ターミナル1: 開発サーバーを起動
cd C:\Users\motim\.cursor\study-site
npm run dev

# ターミナル2: ngrokを起動
ngrok http 5173

# 表示されたURL（例：https://xxxx.ngrok-free.app）をスマホで開く
```

## まとめ

ngrokは、**すぐにインターネット経由でアクセスできるようにする**最も簡単な方法です。

- ✅ 簡単
- ✅ 無料
- ✅ すぐ使える
- ❌ URLが毎回変わる（無料版）
- ❌ セッションが切れる可能性がある





