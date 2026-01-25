# 問題の追加方法

このドキュメントでは、学習サイトに新しい問題を追加する方法を説明します。

## 問題の構造

各問題は以下の形式で定義します：

```typescript
{
  id: 25,                    // 問題ID（既存のIDと重複しない番号）
  subject: 'kokugo',         // 教科: 'kokugo'（国語）または 'shakai'（社会）
  category: 'kanji',         // カテゴリ: 'kanji'（漢字）、'hinshi'（品詞）、'rekishi'（歴史）、'keizai'（経済・政治）
  level: 1,                  // 難易度: 1（初級）、2（中級）、3（上級）
  text: '問題文',            // 問題文
  choices: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],  // 選択肢（4つ）
  correctAnswer: 0,          // 正解のインデックス（0から3の数字）
  explanation: '解説文'      // 解説（オプション、省略可能）
}
```

## 教科とカテゴリの対応

### 国語（kokugo）
- `kanji`: 漢字
- `hinshi`: 品詞

### 社会（shakai）
- `rekishi`: 歴史
- `keizai`: 経済・政治

## レベルについて

- **レベル1**: 初級（基礎的な問題）
- **レベル2**: 中級（標準的な問題）
- **レベル3**: 上級（応用的な問題）

## 問題の追加手順

1. `study-site/src/App.tsx` を開く
2. `initialQuestions` 配列を探す（29行目あたり）
3. 配列の最後に新しい問題オブジェクトを追加

### 例：国語の漢字問題を追加する場合

```typescript
const initialQuestions: Question[] = [
  // ... 既存の問題 ...
  
  // 新しい問題を追加
  {
    id: 25,  // 既存の最大ID + 1
    subject: 'kokugo',
    category: 'kanji',
    level: 1,
    text: '「勉強」の「勉」の読み方は？',
    choices: ['べん', 'まな', 'つと', 'はげ'],
    correctAnswer: 0,  // 'べん' が正解
    explanation: '「勉」は「べん」と読みます。「勉強」は「べんきょう」です。'
  },
]
```

### 例：社会の歴史問題を追加する場合

```typescript
{
  id: 26,
  subject: 'shakai',
  category: 'rekishi',
  level: 2,
  text: '平安時代が始まった年は？',
  choices: ['794年', '800年', '806年', '810年'],
  correctAnswer: 0,  // '794年' が正解
  explanation: '平安時代は794年に桓武天皇が平安京に遷都したことから始まりました。'
}
```

## 注意事項

1. **IDの重複**: 既存の問題IDと重複しないようにしてください
2. **選択肢の数**: 必ず4つの選択肢を用意してください
3. **correctAnswer**: 0から3の数字で、選択肢のインデックスを指定します
   - 0 = 最初の選択肢
   - 1 = 2番目の選択肢
   - 2 = 3番目の選択肢
   - 3 = 4番目の選択肢
4. **explanation**: 解説は省略可能ですが、学習効果を高めるために追加することを推奨します

## 問題を追加した後の確認

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで `http://localhost:5173` を開く
3. 追加した問題が表示されるか確認
4. 問題を解いて、正解・不正解の判定が正しいか確認
5. 結果画面で解説が正しく表示されるか確認

## 変更を反映する

問題を追加したら、GitHubにプッシュしてデプロイします：

```powershell
cd C:\Users\motim\.cursor\study-site
git add .
git commit -m "問題を追加"
git push
```

VercelまたはCloudflare Pagesが自動的に再デプロイします。

