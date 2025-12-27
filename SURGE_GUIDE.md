# Surge.sh 完全ガイド

## Surge.shとは

Surge.shは、コマンド1つで静的サイトをデプロイできる無料のホスティングサービスです。

## メリット

- ✅ **完全無料**
- ✅ **コマンド1つでデプロイ**（超簡単）
- ✅ **設定ファイル不要**
- ✅ **カスタムドメイン対応**（無料）
- ✅ **HTTPS自動対応**
- ✅ **高速**

## デメリット

- ❌ 無料版は広告が表示される場合がある
- ❌ ドメインは `xxxx.surge.sh` 形式のみ（無料版）

## インストール

```powershell
npm install -g surge
```

## デプロイ手順

### 1. プロジェクトをビルド

```powershell
cd C:\Users\motim\.cursor\study-site
npm run build
```

これで `dist` フォルダにビルドされたファイルが生成されます。

### 2. Surgeでデプロイ

```powershell
cd dist
surge
```

### 3. 初回のみ：アカウント作成

初回実行時、以下のように聞かれます：

```
Welcome to Surge! (surge.sh)
Please login or create an account by entering your email and password.
email: あなたのメールアドレス
password: パスワード
```

メールアドレスとパスワードを入力してアカウントを作成します。

### 4. ドメインを入力

次に、ドメイン名を聞かれます：

```
project: dist
domain: study-site.surge.sh
```

- `project`: 現在のディレクトリ（`dist` のままEnter）
- `domain`: 好きなドメイン名（例：`study-site.surge.sh`）

**注意**: ドメイン名は他の人が使っていないものにする必要があります。

### 5. デプロイ完了

デプロイが完了すると、以下のように表示されます：

```
Success! Project is published and running at study-site.surge.sh
```

このURLでサイトにアクセスできます！

## 2回目以降のデプロイ

2回目以降は、同じドメインを使う場合は自動で認識されます：

```powershell
cd dist
surge
```

ドメインを聞かれたら、前回と同じドメインを入力するか、Enterを押すと前回の設定が使われます。

## 便利なコマンド

### 特定のドメインを指定

```powershell
surge dist study-site.surge.sh
```

### カスタムドメインを使う

```powershell
surge dist yourdomain.com
```

（カスタムドメインを使う場合は、DNS設定が必要です）

### プロジェクトを削除

```powershell
surge teardown study-site.surge.sh
```

## よくある質問

### Q: ドメイン名は何でもいいの？

A: はい、`xxxx.surge.sh` 形式で、他の人が使っていないものであれば何でもOKです。

### Q: 更新するには？

A: `npm run build` でビルドし直して、`surge` を実行するだけです。

### Q: 無料で使える？

A: はい、完全無料です。カスタムドメインも無料で使えます。

### Q: ファイルサイズの制限は？

A: 無料版でも十分な容量が使えます（通常の静的サイトなら問題なし）。

## トラブルシューティング

### エラー: `surge: command not found`

```powershell
npm install -g surge
```

### エラー: ドメインが既に使われている

別のドメイン名を試してください（例：`study-site-2024.surge.sh`）

### ログアウトしたい

```powershell
surge logout
```

### ログイン情報を確認

```powershell
surge whoami
```

## 実際の使用例

```powershell
# 1. ビルド
cd C:\Users\motim\.cursor\study-site
npm run build

# 2. distフォルダに移動
cd dist

# 3. デプロイ
surge

# 4. ドメインを入力（初回のみ）
# domain: study-site.surge.sh

# 完了！ https://study-site.surge.sh でアクセス可能
```

## まとめ

Surge.shは、**最も簡単にサイトを公開できる方法**の一つです。

- コマンド2つ（`npm run build` → `surge`）で完了
- 設定ファイル不要
- 完全無料
- 高速

VercelやNetlifyでエラーが出る場合の代替手段として最適です！


