# インターネット経由でアクセスする方法

## 方法1: Cloudflare Tunnel（推奨・無料・安全）

### インストール

1. [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) からダウンロード
2. または、PowerShellで：
```powershell
winget install --id Cloudflare.cloudflared
```

### 使い方

1. 開発サーバーを起動：
```powershell
cd C:\Users\motim\.cursor\study-site
npm run dev
```

2. 別のターミナルでCloudflare Tunnelを起動：
```powershell
cloudflared tunnel --url http://localhost:5173
```

3. 表示されたURL（例：`https://xxxx.trycloudflare.com`）を他のデバイスで開く

**メリット**: 
- 無料
- Cloudflareが提供（セキュア）
- 簡単

**デメリット**:
- URLが毎回変わる（無料版）
- セッションが切れるとURLが無効になる

---

## 方法2: ngrok（簡単・無料）

### インストール

```powershell
npm install -g ngrok
```

### 使い方

1. 開発サーバーを起動：
```powershell
npm run dev
```

2. 別のターミナルで：
```powershell
ngrok http 5173
```

3. 表示されたURL（例：`https://xxxx.ngrok.io`）を他のデバイスで開く

**メリット**: 簡単、すぐ使える

**デメリット**: 
- 無料版はURLが変わる
- セキュリティ面で不安がある場合がある

---

## 方法3: Cloudflare Pagesでデプロイ（最も確実）

Cloudflare Pagesでデプロイすれば、インターネット経由で誰でもアクセスできます。

**メリット**:
- 永続的なURL
- セキュア
- 無料

**デメリット**: 
- 設定が少し複雑
- コードを変更するたびにデプロイが必要

---

## おすすめ

**一時的な共有**: Cloudflare Tunnel
**永続的な共有**: Cloudflare Pages


