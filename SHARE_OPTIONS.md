# サイトを共有する簡単な方法

## 方法1: Netlify（Vercelの代替）

### 手順
1. [Netlify](https://www.netlify.com) にアクセス
2. 「Sign up」→「GitHub」でログイン
3. 「Add new site」→「Import an existing project」
4. GitHubリポジトリを選択
5. 設定（自動で認識される）：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 「Deploy site」をクリック

**メリット**: Vercelより設定が簡単な場合がある

---

## 方法2: GitHub Pages（無料・簡単）

### 手順
1. GitHubリポジトリの **Settings** → **Pages** を開く
2. **Source** で「GitHub Actions」を選択
3. 以下のワークフローファイルを作成：

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. ファイルをコミット・プッシュ
5. 数分待つと `https://あなたのユーザー名.github.io/study-site` でアクセス可能

**メリット**: 完全無料、GitHub内で完結

---

## 方法3: Cloudflare Pages（無料・高速）

### 手順
1. [Cloudflare](https://pages.cloudflare.com) にアクセス
2. 「Sign up」でアカウント作成
3. 「Create a project」→「Connect to Git」
4. GitHubリポジトリを選択
5. 設定：
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
6. 「Save and Deploy」をクリック

**メリット**: 高速、無料、設定が簡単

---

## 方法4: ngrok（一時的な共有）

### 手順
1. [ngrok](https://ngrok.com) でアカウント作成
2. ngrokをダウンロード・インストール
3. ローカルで開発サーバーを起動：
   ```powershell
   npm run dev
   ```
4. 別のターミナルで：
   ```powershell
   ngrok http 5173
   ```
5. 表示されたURL（例：`https://xxxx.ngrok.io`）を共有

**メリット**: すぐに共有できる、設定不要
**デメリット**: 無料版はURLが変わる、一時的

---

## 方法5: Surge.sh（コマンド1つでデプロイ）

### 手順
1. Surgeをインストール：
   ```powershell
   npm install -g surge
   ```
2. ビルド：
   ```powershell
   npm run build
   ```
3. デプロイ：
   ```powershell
   cd dist
   surge
   ```
4. アカウント作成（初回のみ）
5. ドメインを入力（例：`study-site.surge.sh`）

**メリット**: コマンド1つでデプロイ、無料

---

## おすすめ

1. **最も簡単**: **Cloudflare Pages** または **Netlify**
2. **GitHub内で完結**: **GitHub Pages**
3. **すぐに共有**: **ngrok**（一時的）


