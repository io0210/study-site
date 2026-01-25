# Cloudflare Pages 完全解決ガイド

## 今すぐやること（順番に実行）

### ステップ1: プロジェクトを削除

1. Cloudflare Pagesのダッシュボードを開く
2. 現在のプロジェクト（`study-site-star`など）を開く
3. 「Settings」→「General」を開く
4. 下の方に「Delete project」があるので、クリックして削除

### ステップ2: 新しくプロジェクトを作成

1. 「Create a project」をクリック
2. 「Connect to Git」を選択
3. GitHubアカウントを連携（初回のみ）
4. リポジトリ `io0210/study-site` を選択
5. 「Begin setup」をクリック

### ステップ3: 設定を入力（重要！）

以下の設定を**正確に**入力してください：

- **Project name**: `my-study-quiz`（好きな名前、他の人と被らないもの）
- **Production branch**: `main`（デフォルトでOK）
- **Framework preset**: `Vite` を選択（ドロップダウンから）
- **Build command**: `npm run build`（手動で入力）
- **Build output directory**: `dist`（手動で入力）
- **Deploy command**: `echo "Deploy completed"`（手動で入力、必須）

### ステップ4: デプロイ

1. 「Save and Deploy」をクリック
2. 数分待つ（1〜3分）
3. デプロイが完了したら、URLが表示されます
4. そのURLをクリックしてサイトを確認

## 確認事項

デプロイが完了したら：

1. URLが表示されているか確認
2. そのURLを開いて、「教科別 学習クイズ」と表示されるか確認
3. クイズが開始できるか確認

## エラーが出た場合

### エラー: `dist: not found`
→ 「Deploy command」に`dist`が入力されている。`echo "Deploy completed"`に変更

### エラー: `package.json not found`
→ GitHubリポジトリのルートに`package.json`があるか確認

### 「Hello world」と表示される
→ プロジェクトを再作成して、設定を正確に入力

## 重要なポイント

- **Deploy command**は必ず`echo "Deploy completed"`を入力
- **Build output directory**は必ず`dist`を入力
- プロジェクト名は他の人と被らないものにする





