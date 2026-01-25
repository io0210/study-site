# Cloudflare Pages 設定ガイド

## プロジェクト作成時の設定

1. **Framework preset**: `Vite` を選択
2. **Build command**: `npm run build`
3. **Build output directory**: `dist`
4. **Deploy command**: `echo "Deploy completed"` を入力

## 重要なポイント

- **Deploy command**は必須項目なので、`echo "Deploy completed"` を入力してください
- **Build output directory**は`dist`にしてください
- **Production branch**は`main`にしてください

## トラブルシューティング

### 「Hello world」と表示される場合

1. GitHubリポジトリの内容を確認
2. 最新のコードがプッシュされているか確認
3. プロジェクトを再作成

### デプロイがクリックできない場合

1. ページをリロード（F5）
2. 別のブラウザで試す
3. プロジェクトを再作成





