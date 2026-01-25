import { useState, useMemo, useEffect, useRef } from 'react'
import { useAuth } from './authContext'

type Level = 1 | 2 | 3 | 'random'

type Question = {
  id: number
  level: 1 | 2 | 3
  text: string
  choices: string[]
  correctAnswer: number
  explanation?: string // 解説（オプション）
}

type QuizSession = {
  id: string
  level: Level
  date: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
}

const initialQuestions: Question[] = [
  // レベル1（基礎）
  {
    id: 2,
    level: 1,
    text: '149.40円と149.38円の差はいくらか。',
    choices: ['0.01円', '0.02円', '0.03円', '0.04円'],
    correctAnswer: 1,
    explanation: '149.40 − 149.38 = 0.02。',
  },
  {
    id: 3,
    level: 1,
    text: '水質検査で使われる代表的な消毒方法を答えよ。',
    choices: ['塩素消毒', 'オゾン消毒', '紫外線消毒', '煮沸消毒'],
    correctAnswer: 0,
    explanation: 'プールや水道水では、細菌を除去するために塩素が用いられる。',
  },
  {
    id: 4,
    level: 1,
    text: 'ふるさと納税はどの自治体に寄付できる制度か。',
    choices: ['全国の自治体', '出身地の自治体のみ', '現在住んでいる自治体のみ', '都道府県のみ'],
    correctAnswer: 0,
    explanation: '居住地に限らず、任意の自治体に寄付できる制度である。',
  },
  {
    id: 5,
    level: 1,
    text: 'word の意味を答えなさい。',
    choices: ['言葉', '世界', '働く', '価値'],
    correctAnswer: 0,
    explanation: '基本的な名詞の意味を確認する問題。',
  },
  {
    id: 7,
    level: 1,
    text: '件数が203件増加したとき、前年より多いか少ないか。',
    choices: ['多い', '少ない', '同じ', '不明'],
    correctAnswer: 0,
    explanation: '「増加」とあるため、前年より数は多い。',
  },
  {
    id: 8,
    level: 1,
    text: '細菌が増えると問題になる理由を答えよ。',
    choices: [
      '感染症などの健康被害が起こるため',
      '水が濁るため',
      '温度が上がるため',
      '色が変わるため'
    ],
    correctAnswer: 0,
    explanation: '細菌の増殖は病気の原因になる。',
  },
  {
    id: 9,
    level: 1,
    text: '選挙後に国会が開かれる理由を答えなさい。',
    choices: [
      '選挙結果を受けて政治判断を行うため',
      '新しい法律を作るため',
      '予算を決めるため',
      '内閣を選ぶため'
    ],
    correctAnswer: 0,
    explanation: '新たな民意を政策や政権運営に反映させる必要がある。',
  },
  {
    id: 10,
    level: 1,
    text: 'positive の意味を答えなさい。',
    choices: ['前向きな', '否定的な', '中立的な', '複雑な'],
    correctAnswer: 0,
    explanation: '人物描写や考え方を表す基本形容詞。',
  },
  {
    id: 26,
    level: 1,
    text: '「惜しくも敗れた」の意味として正しいものはどれか。',
    choices: ['完全に失敗した', '価値がない', '勝てそうだったが負けた', '途中で中止された'],
    correctAnswer: 2,
    explanation: '「惜しくも」は「残念ながら、あと少しで」という意味を表す。',
  },
  {
    id: 27,
    level: 1,
    text: '95万円と5万円の合計はどれか。',
    choices: ['90万円', '95万円', '100万円', '105万円'],
    correctAnswer: 2,
    explanation: '95 + 5 = 100。',
  },
  {
    id: 28,
    level: 1,
    text: '水の消毒に最もよく使われる物質はどれか。',
    choices: ['酸素', '窒素', '塩素', '二酸化炭素'],
    correctAnswer: 2,
    explanation: '塩素は殺菌作用が強く、水道水やプールの消毒に広く使われる。',
  },
  {
    id: 29,
    level: 1,
    text: '不衛生な水で最も影響を受けやすい器官はどれか。',
    choices: ['心臓', '肺', '胃腸', '骨'],
    correctAnswer: 2,
    explanation: '不衛生な水を飲むと、細菌やウイルスが胃腸に入り、下痢や嘔吐などの症状を引き起こす。',
  },
  {
    id: 30,
    level: 1,
    text: 'ふるさと納税の目的として最も適切なものはどれか。',
    choices: ['国の利益', '地方自治体の支援', '海外援助', '企業活動'],
    correctAnswer: 1,
    explanation: 'ふるさと納税は、地方自治体への寄付を通じて地域を支援する制度である。',
  },
  {
    id: 31,
    level: 1,
    text: '選挙の役割として正しいものはどれか。',
    choices: ['法律を決める', '裁判を行う', '国民の意思を反映する', '予算を管理する'],
    correctAnswer: 2,
    explanation: '選挙は、国民が代表者を選び、政治的意思を反映させる民主主義の基本制度である。',
  },
  {
    id: 33,
    level: 1,
    text: '「言葉の重み」が示す内容はどれか。',
    choices: ['発音の強さ', '音量', '経験に裏打ちされた意味', '文字数'],
    correctAnswer: 2,
    explanation: '「言葉の重み」は、経験や実践に基づいた言葉が持つ深い意味や説得力のことを指す。',
  },
  {
    id: 34,
    level: 1,
    text: '4600万円を100万円単位で表すとどれか。',
    choices: ['4.6', '46', '460', '4600'],
    correctAnswer: 1,
    explanation: '4600 ÷ 100 = 46。',
  },
  {
    id: 35,
    level: 1,
    text: '細菌が増えやすい環境はどれか。',
    choices: ['乾燥して寒い', '暗く冷たい', '温かく湿った', '強風下'],
    correctAnswer: 2,
    explanation: '細菌は温度が適度に高く、湿度がある環境で活発に増殖する。',
  },
  {
    id: 36,
    level: 1,
    text: '消毒の目的として正しいものはどれか。',
    choices: ['水を甘くする', '色を変える', '微生物を減らす', '温度を下げる'],
    correctAnswer: 2,
    explanation: '消毒は、病原菌や有害な微生物を殺菌・除去して、安全な状態にすることを目的とする。',
  },
  {
    id: 37,
    level: 1,
    text: '行政機関の例として正しいものはどれか。',
    choices: ['裁判所', '市役所', '新聞社', '学校'],
    correctAnswer: 1,
    explanation: '市役所は地方自治体の行政機関であり、住民サービスや行政事務を行う。',
  },
  {
    id: 38,
    level: 1,
    text: 'carry の基本的な意味はどれか。',
    choices: ['投げる', '運ぶ', '壊す', '隠す'],
    correctAnswer: 1,
    explanation: 'carry は「運ぶ、持っていく」という意味の基本的な動詞である。',
  },
  {
    id: 39,
    level: 1,
    text: 'difference の意味はどれか。',
    choices: ['同一', '変化', '違い', '危険'],
    correctAnswer: 2,
    explanation: 'difference は「違い、差異、相違」という意味の名詞である。',
  },
  {
    id: 70,
    level: 1,
    text: '「全力を尽くした」と最も近い意味はどれか。',
    choices: ['適当に行った', '最後まで真剣に行った', '途中でやめた', '他人に任せた'],
    correctAnswer: 1,
    explanation: '「全力を尽くす」は「できる限りの力を出し切る」という意味。',
  },
  {
    id: 71,
    level: 1,
    text: '250万円は何円か。',
    choices: ['2万5千円', '25万円', '250万円', '2500万円'],
    correctAnswer: 2,
    explanation: '250万円はそのまま250万円である。',
  },
  {
    id: 72,
    level: 1,
    text: '100万円を4人で等しく分けると1人分はいくらか。',
    choices: ['20万円', '25万円', '40万円', '50万円'],
    correctAnswer: 1,
    explanation: '100 ÷ 4 = 25。',
  },
  {
    id: 73,
    level: 1,
    text: '細菌は主に何によって増えるか。',
    choices: ['光', '音', '栄養と水分', '風'],
    correctAnswer: 2,
    explanation: '細菌は適切な温度、栄養、水分がある環境で増殖する。',
  },
  {
    id: 74,
    level: 1,
    text: '水を消毒する目的として正しいものはどれか。',
    choices: ['色をよくする', '味を変える', '安全に使えるようにする', '温度を上げる'],
    correctAnswer: 2,
    explanation: '消毒は病原菌や有害な微生物を除去して、安全に使用できるようにするため。',
  },
  {
    id: 75,
    level: 1,
    text: '市役所の仕事として最も適切なものはどれか。',
    choices: ['法律を作る', '裁判を行う', '住民サービスを行う', '国防を担う'],
    correctAnswer: 2,
    explanation: '市役所は地方自治体の行政機関として、住民の生活に必要なサービスを提供する。',
  },
  {
    id: 76,
    level: 1,
    text: '地方自治体の例として正しいものはどれか。',
    choices: ['国会', '内閣', '市町村', '裁判所'],
    correctAnswer: 2,
    explanation: '市町村は地方自治体の基本単位であり、住民に身近な行政サービスを提供する。',
  },
  {
    id: 77,
    level: 1,
    text: 'people の意味はどれか。',
    choices: ['人々', '子ども', '家族', '先生'],
    correctAnswer: 0,
    explanation: 'people は「人々、人たち」という意味の名詞である。',
  },
  {
    id: 78,
    level: 1,
    text: 'stay の意味として正しいものはどれか。',
    choices: ['走る', '変わる', 'とどまる', '壊す'],
    correctAnswer: 2,
    explanation: 'stay は「とどまる、滞在する、残る」という意味の動詞である。',
  },
  {
    id: 79,
    level: 1,
    text: '876件から673件を引いた差はどれか。',
    choices: ['203件', '213件', '173件', '183件'],
    correctAnswer: 0,
    explanation: '876 − 673 = 203。',
  },
  {
    id: 80,
    level: 1,
    text: '200万円の5％はどれか。',
    choices: ['5万円', '10万円', '15万円', '20万円'],
    correctAnswer: 1,
    explanation: '200 × 0.05 = 10。',
  },
  {
    id: 81,
    level: 1,
    text: '塩素が使われる理由として正しいものはどれか。',
    choices: ['香りがよい', '安価で安全', '強い殺菌作用', '色がつく'],
    correctAnswer: 2,
    explanation: '塩素は細菌やウイルスに対して強い殺菌作用を持つため、消毒に広く使われる。',
  },
  {
    id: 82,
    level: 1,
    text: '細菌が原因となる病気の例はどれか。',
    choices: ['骨折', '食中毒', '失明', '打撲'],
    correctAnswer: 1,
    explanation: '食中毒は細菌やウイルスが原因で起こる感染症の一種である。',
  },
  {
    id: 83,
    level: 1,
    text: '国会で話し合われる内容として正しいものはどれか。',
    choices: ['校則', '法律や予算', '試合結果', '天気'],
    correctAnswer: 1,
    explanation: '国会は法律の制定や予算の審議など、国の重要な政策を決定する機関である。',
  },
  {
    id: 84,
    level: 1,
    text: '選挙権を持つのはどのような人か。',
    choices: ['外国人', '未成年', '有権者', '公務員のみ'],
    correctAnswer: 2,
    explanation: '選挙権は、日本国籍を持ち、18歳以上の有権者が持つ権利である。',
  },
  {
    id: 85,
    level: 1,
    text: 'difficult の意味はどれか。',
    choices: ['簡単な', '危険な', '難しい', '楽しい'],
    correctAnswer: 2,
    explanation: 'difficult は「難しい、困難な」という意味の形容詞である。',
  },
  {
    id: 86,
    level: 1,
    text: 'even if の意味に最も近いものはどれか。',
    choices: ['そして', 'もしも', 'たとえ〜でも', 'なぜなら'],
    correctAnswer: 2,
    explanation: 'even if は「たとえ〜でも、たとえ〜だとしても」という意味の接続詞である。',
  },
  // レベル2（標準・応用）
  {
    id: 12,
    level: 2,
    text: '4600万円と250万円の合計を求めよ。',
    choices: ['4750万円', '4800万円', '4850万円', '4900万円'],
    correctAnswer: 2,
    explanation: '4600 + 250 = 4850。',
  },
  {
    id: 13,
    level: 2,
    text: '塩素が殺菌に使われる理由を答えよ。',
    choices: [
      '細菌の細胞を破壊するため',
      '水の温度を上げるため',
      '水の色を変えるため',
      '水の量を増やすため'
    ],
    correctAnswer: 0,
    explanation: '塩素には強い殺菌作用がある。',
  },
  {
    id: 14,
    level: 2,
    text: '総括委員会の役割を説明しなさい。',
    choices: [
      '選挙結果の原因を分析し、改善につなげること',
      '選挙の実施を管理すること',
      '候補者を選ぶこと',
      '投票を集計すること'
    ],
    correctAnswer: 0,
    explanation: '民主政治では振り返りが重要。',
  },
  {
    id: 15,
    level: 2,
    text: 'Words carry weight. を和訳しなさい。',
    choices: [
      '言葉には重みがある',
      '言葉を運ぶ',
      '言葉が重い',
      '言葉を重ねる'
    ],
    correctAnswer: 0,
    explanation: '直訳ではなく比喩表現として理解する。',
  },
  {
    id: 17,
    level: 2,
    text: '被害額が前年比25％増のとき、前年額の求め方を答えよ。',
    choices: [
      '現在額を1.25で割る',
      '現在額を0.25で割る',
      '現在額から0.25を引く',
      '現在額に1.25をかける'
    ],
    correctAnswer: 0,
    explanation: '割合の逆算。',
  },
  {
    id: 18,
    level: 2,
    text: '水質問題の再発防止策を科学的に述べなさい。',
    choices: [
      '設備点検の強化や自動監視の導入',
      '水の使用量を減らす',
      '水の価格を上げる',
      '水の供給を停止する'
    ],
    correctAnswer: 0,
    explanation: '原因から対策を論理的に導く。',
  },
  {
    id: 19,
    level: 2,
    text: '排外主義が社会に与える影響を説明しなさい。',
    choices: [
      '差別や社会の分断を生む',
      '経済を発展させる',
      '文化を保護する',
      '治安を改善する'
    ],
    correctAnswer: 0,
    explanation: '人権・民主主義の観点。',
  },
  {
    id: 20,
    level: 2,
    text: 'She wants to ___ a difference.',
    choices: ['make', 'do', 'take', 'get'],
    correctAnswer: 0,
    explanation: 'make a difference で「変化をもたらす」。',
  },
  {
    id: 41,
    level: 2,
    text: '876件が前年比203件増だった。前年はどれか。',
    choices: ['673件', '679件', '700件', '1080件'],
    correctAnswer: 0,
    explanation: '876 − 203 = 673。',
  },
  {
    id: 42,
    level: 2,
    text: '250万円の10％はどれか。',
    choices: ['2.5万円', '25万円', '250万円', '2500万円'],
    correctAnswer: 1,
    explanation: '250 × 0.1 = 25。',
  },
  {
    id: 43,
    level: 2,
    text: '塩素が細菌に対して行う作用はどれか。',
    choices: ['増殖', '変色', '細胞破壊', '冷却'],
    correctAnswer: 2,
    explanation: '塩素は細菌の細胞膜や内部構造を破壊して殺菌する。',
  },
  {
    id: 44,
    level: 2,
    text: '水質基準を超えるとまず行われる対応はどれか。',
    choices: ['放置', '利用停止', '値下げ', '広告'],
    correctAnswer: 1,
    explanation: '安全を最優先し、基準を超えた場合は利用を停止する。',
  },
  {
    id: 45,
    level: 2,
    text: '総括委員会の目的として最も適切なものはどれか。',
    choices: ['宣伝', '祝賀', '振り返り', '任命'],
    correctAnswer: 2,
    explanation: '選挙結果を分析し、今後の改善につなげるための振り返りが目的。',
  },
  {
    id: 46,
    level: 2,
    text: '報道が民主主義に必要な理由はどれか。',
    choices: ['娯楽提供', '世論形成', '商業目的', '宣伝'],
    correctAnswer: 1,
    explanation: '正確な情報提供により、国民が判断材料を得て世論が形成される。',
  },
  {
    id: 47,
    level: 2,
    text: 'Words carry weight. の意味として正しいものはどれか。',
    choices: ['言葉は重い物体', '言葉は長い', '言葉には影響力がある', '言葉は遅い'],
    correctAnswer: 2,
    explanation: '「重み」は比喩で、影響力や説得力を意味する。',
  },
  {
    id: 48,
    level: 2,
    text: 'even の役割として正しいものはどれか。',
    choices: ['否定', '強調', '過去', '比較'],
    correctAnswer: 1,
    explanation: 'even は「〜でさえも」という意味で、強調の役割を持つ。',
  },
  {
    id: 50,
    level: 2,
    text: '被害額が100万円から125万円に増えたとき、増加率はどれか。',
    choices: ['12.5％', '20％', '25％', '125％'],
    correctAnswer: 2,
    explanation: '（25÷100）×100 = 25％。',
  },
  {
    id: 51,
    level: 2,
    text: '現在額が前年比25％増で125万円のとき、前年額はどれか。',
    choices: ['80万円', '90万円', '100万円', '110万円'],
    correctAnswer: 2,
    explanation: '125 ÷ 1.25 = 100。',
  },
  {
    id: 52,
    level: 2,
    text: '水質管理が個人だけでなく社会全体に必要な理由はどれか。',
    choices: [
      '費用が安いから',
      '観光客が増えるから',
      '多くの人の健康に影響するから',
      '見た目がよくなるから'
    ],
    correctAnswer: 2,
    explanation: '公衆衛生の視点。',
  },
  {
    id: 53,
    level: 2,
    text: '消毒装置の停止がすぐに問題となる理由はどれか。',
    choices: [
      '水が減るから',
      '細菌が短時間で増殖するから',
      '温度が下がるから',
      '色が変わるから'
    ],
    correctAnswer: 1,
    explanation: '微生物は条件がそろうと急増する。',
  },
  {
    id: 54,
    level: 2,
    text: '排外主義的な発言が民主社会で問題視される主な理由はどれか。',
    choices: [
      '経済効率が悪い',
      '差別や分断を助長する',
      '法律に必ず違反する',
      '若者に人気がない'
    ],
    correctAnswer: 1,
    explanation: '人権と共生の観点。',
  },
  {
    id: 55,
    level: 2,
    text: '報道が権力を監視する役割を持つのはなぜか。',
    choices: [
      '娯楽を提供するため',
      '国民の知る権利を守るため',
      '政府を助けるため',
      '視聴率を上げるため'
    ],
    correctAnswer: 1,
    explanation: '民主主義の基盤。',
  },
  {
    id: 56,
    level: 2,
    text: 'make a difference の意味として正しいものはどれか。',
    choices: ['違いを比較する', '失敗する', '変化をもたらす', '間違いを探す'],
    correctAnswer: 2,
    explanation: '熟語表現。',
  },
  {
    id: 57,
    level: 2,
    text: '次の文で空欄に入る語はどれか。Words can influence people\'s ___.',
    choices: ['houses', 'choices', 'prices', 'names'],
    correctAnswer: 1,
    explanation: '影響を受ける対象は「選択」。',
  },
  {
    id: 90,
    level: 2,
    text: '125万円が25％増しであるとき、元の金額はどれか。',
    choices: ['80万円', '90万円', '100万円', '110万円'],
    correctAnswer: 2,
    explanation: '125 ÷ 1.25 = 100。',
  },
  {
    id: 91,
    level: 2,
    text: '1.1を2回掛けた値として正しいものはどれか。',
    choices: ['1.2', '1.21', '1.3', '2.2'],
    correctAnswer: 1,
    explanation: '1.1 × 1.1 = 1.21。',
  },
  {
    id: 92,
    level: 2,
    text: '公衆衛生の対象として最も適切なものはどれか。',
    choices: ['個人の好み', '集団の健康', '芸術活動', '経済成長'],
    correctAnswer: 1,
    explanation: '公衆衛生は社会全体の健康を守ることを目的とする。',
  },
  {
    id: 93,
    level: 2,
    text: '水質検査を行う主な目的はどれか。',
    choices: ['水量確認', '温度測定', '安全性確認', '色調調査'],
    correctAnswer: 2,
    explanation: '水質検査は、水が安全に使用できるかを確認するために行われる。',
  },
  {
    id: 94,
    level: 2,
    text: '報道が果たす役割として最も適切なものはどれか。',
    choices: ['権力の監視', '国民の統制', '娯楽提供のみ', '政府の代弁'],
    correctAnswer: 0,
    explanation: '報道は権力を監視し、国民に情報を提供する役割を持つ。',
  },
  {
    id: 95,
    level: 2,
    text: '世論形成に最も影響を与えるものはどれか。',
    choices: ['天候', '報道', '地形', '人口'],
    correctAnswer: 1,
    explanation: '報道は情報を提供し、国民の意見形成に大きな影響を与える。',
  },
  {
    id: 96,
    level: 2,
    text: 'shape の意味として正しいものはどれか。',
    choices: ['壊す', '形作る', '隠す', '比べる'],
    correctAnswer: 1,
    explanation: 'shape は「形作る、形成する」という意味の動詞である。',
  },
  {
    id: 97,
    level: 2,
    text: '次の文で最も自然な続きはどれか。Experience ___ people\'s values.',
    choices: ['runs', 'shapes', 'eats', 'breaks'],
    correctAnswer: 1,
    explanation: '経験は価値観を形作る（shape）という意味が自然。',
  },
  {
    id: 98,
    level: 2,
    text: '被害額が80万円から100万円に増えたとき、増加率として正しいものはどれか。',
    choices: ['20％', '25％', '30％', '80％'],
    correctAnswer: 1,
    explanation: '（20÷80）×100 = 25％。',
  },
  {
    id: 99,
    level: 2,
    text: '前年比25％増の金額が200万円であるとき、前年額はどれか。',
    choices: ['150万円', '160万円', '180万円', '200万円'],
    correctAnswer: 1,
    explanation: '200 ÷ 1.25 = 160。',
  },
  {
    id: 100,
    level: 2,
    text: '水質検査で「基準値」が設定されている主な理由はどれか。',
    choices: [
      '水を節約するため',
      '判断を個人に任せないため',
      '味を一定にするため',
      '温度を保つため'
    ],
    correctAnswer: 1,
    explanation: '客観的・科学的判断のため。',
  },
  {
    id: 101,
    level: 2,
    text: '細菌が検出された後に行われる対応として最も適切なものはどれか。',
    choices: [
      'すぐに再開',
      '原因調査と改善',
      '無視する',
      '利用者に責任を求める'
    ],
    correctAnswer: 1,
    explanation: '再発防止が目的。',
  },
  {
    id: 102,
    level: 2,
    text: '選挙後に政党が「総括」を行う意義として最も適切なものはどれか。',
    choices: [
      '支持者を増やすため',
      '責任を回避するため',
      '政策や戦略を見直すため',
      '法律で決まっているため'
    ],
    correctAnswer: 2,
    explanation: '次につなげる振り返り。',
  },
  {
    id: 103,
    level: 2,
    text: '報道が多様な意見を伝える必要がある理由はどれか。',
    choices: [
      '視聴率を上げるため',
      '国民の判断材料を増やすため',
      '政府を支援するため',
      '混乱を招くため'
    ],
    correctAnswer: 1,
    explanation: '民主主義の前提。',
  },
  {
    id: 104,
    level: 2,
    text: '次の文の意味として正しいものはどれか。Words can shape society.',
    choices: [
      '言葉は社会を破壊する',
      '言葉は社会を形作る',
      '言葉は社会に不要',
      '言葉は社会を隠す'
    ],
    correctAnswer: 1,
    explanation: 'shape＝形作る。',
  },
  {
    id: 105,
    level: 2,
    text: '次の空欄に入る語として最も適切なものはどれか。Media ___ public opinion.',
    choices: ['eats', 'shapes', 'throws', 'hides'],
    correctAnswer: 1,
    explanation: '世論形成の文脈。',
  },
  // レベル3（発展）
  {
    id: 22,
    level: 3,
    text: '1兆2728億円を1080万人で割り、1人当たりの金額を概算せよ。',
    choices: ['約10.8万円', '約11.5万円', '約11.8万円', '約12.2万円'],
    correctAnswer: 2,
    explanation: '概算処理を用いる。',
  },
  {
    id: 23,
    level: 3,
    text: '公衆衛生の重要性を具体例を用いて説明せよ。',
    choices: [
      '水質管理によって集団の健康が守られる',
      '個人の健康管理が重要である',
      '医療費を削減できる',
      '環境を保護できる'
    ],
    correctAnswer: 0,
    explanation: '個人ではなく社会全体の視点。',
  },
  {
    id: 24,
    level: 3,
    text: '現代民主主義における報道の役割を述べよ。',
    choices: [
      '国民に正確な情報を伝え、判断材料を提供すること',
      '政府の政策を支持すること',
      '国民の意見を代弁すること',
      '経済を発展させること'
    ],
    correctAnswer: 0,
    explanation: '報道の公共性。',
  },
  {
    id: 61,
    level: 3,
    text: '被害額が毎年10％ずつ増えるとき、2年後の倍率はどれか。',
    choices: ['1.1倍', '1.2倍', '1.21倍', '2倍'],
    correctAnswer: 2,
    explanation: '1.1 × 1.1 = 1.21。',
  },
  {
    id: 62,
    level: 3,
    text: '1兆2728億円を約1000万人で割った概算として最も近いものはどれか。',
    choices: ['約1万円', '約10万円', '約100万円', '約1000万円'],
    correctAnswer: 1,
    explanation: '桁を意識した概算。',
  },
  {
    id: 63,
    level: 3,
    text: '公衆衛生が守られない社会で起こりやすい事例はどれか。',
    choices: [
      '芸術活動の衰退',
      '感染症の流行',
      '技術革新の停滞',
      '物価の安定'
    ],
    correctAnswer: 1,
    explanation: '集団感染のリスク。',
  },
  {
    id: 64,
    level: 3,
    text: '水質事故の再発防止として最も効果的なのはどれか。',
    choices: [
      '注意喚起のみ',
      '利用者任せ',
      '定期点検と監視体制',
      '使用回数制限'
    ],
    correctAnswer: 2,
    explanation: '原因への直接対応。',
  },
  {
    id: 65,
    level: 3,
    text: '民主主義社会において報道が果たす最重要な役割はどれか。',
    choices: [
      '政府の宣伝',
      '国民への娯楽提供',
      '判断材料の提供',
      '経済活動の促進'
    ],
    correctAnswer: 2,
    explanation: '主権者の判断を支える。',
  },
  {
    id: 66,
    level: 3,
    text: '選挙後に「総括」を行うことの意義はどれか。',
    choices: [
      '勝者を祝うため',
      '責任の所在を曖昧にするため',
      '次の政策改善につなげるため',
      '世論を無視するため'
    ],
    correctAnswer: 2,
    explanation: 'PDCAの考え方。',
  },
  {
    id: 67,
    level: 3,
    text: 'Experience shapes the way people think. の意味として正しいものはどれか。',
    choices: [
      '経験は人の考え方を形作る',
      '経験は人を疲れさせる',
      '経験は人を混乱させる',
      '経験は不要である'
    ],
    correctAnswer: 0,
    explanation: '抽象文の理解。',
  },
  {
    id: 68,
    level: 3,
    text: '次の文の要約として最も適切なものはどれか。The article shows how challenges influence values and words.',
    choices: [
      '困難は価値観や言葉に影響を与える',
      '困難は避けるべきだ',
      '言葉は軽い',
      '価値観は変わらない'
    ],
    correctAnswer: 0,
    explanation: '要点一致。',
  },
  {
    id: 110,
    level: 3,
    text: '被害額が毎年20％ずつ増えると仮定した場合、2年後の倍率はどれか。',
    choices: ['1.2倍', '1.4倍', '1.44倍', '2倍'],
    correctAnswer: 2,
    explanation: '1.2 × 1.2 = 1.44。',
  },
  {
    id: 111,
    level: 3,
    text: '1兆円を1000万人で割った概算として最も近いものはどれか。',
    choices: ['約1万円', '約10万円', '約100万円', '約1000万円'],
    correctAnswer: 1,
    explanation: '桁感覚の問題。',
  },
  {
    id: 112,
    level: 3,
    text: '公衆衛生の考え方として最も適切なものはどれか。',
    choices: [
      '個人の自由を最優先',
      '集団全体の安全を重視',
      '経済活動を制限',
      '科学を使わない'
    ],
    correctAnswer: 1,
    explanation: '社会全体の健康を守る。',
  },
  {
    id: 113,
    level: 3,
    text: '水質事故の情報を速やかに公表する理由として正しいものはどれか。',
    choices: [
      '不安をあおるため',
      '責任を回避するため',
      '被害拡大を防ぐため',
      '規則だから'
    ],
    correctAnswer: 2,
    explanation: 'リスク管理。',
  },
  {
    id: 114,
    level: 3,
    text: '民主主義社会で報道の自由が保障される理由はどれか。',
    choices: [
      '政府を守るため',
      '国民の知る権利のため',
      '経済を成長させるため',
      '伝統だから'
    ],
    correctAnswer: 1,
    explanation: '基本的人権。',
  },
  {
    id: 115,
    level: 3,
    text: '選挙結果を分析し公表することの意義はどれか。',
    choices: [
      '混乱を招く',
      '対立を深める',
      '政治参加を促す',
      '権力を集中させる'
    ],
    correctAnswer: 2,
    explanation: '民主政治の活性化。',
  },
  {
    id: 116,
    level: 3,
    text: '次の英文の要旨として最も適切なものはどれか。Experience and challenges give meaning to people\'s words.',
    choices: [
      '経験は不要である',
      '言葉は軽い',
      '経験が言葉に意味を与える',
      '言葉は偶然生まれる'
    ],
    correctAnswer: 2,
    explanation: '要点一致。',
  },
  {
    id: 117,
    level: 3,
    text: '次の日本文に最も近い英文はどれか。「言葉は人の行動に影響を与える。」',
    choices: [
      'Words stop people\'s actions.',
      'Words influence people\'s actions.',
      'Words ignore people\'s actions.',
      'Words hide people\'s actions.'
    ],
    correctAnswer: 1,
    explanation: 'influence＝影響を与える。',
  },
]

const levelNames: Record<Level, string> = {
  1: 'レベル1',
  2: 'レベル2',
  3: 'レベル3',
  random: 'ランダム',
}

// ローカルストレージのキー
const STORAGE_KEY = 'study-site-quiz-history'

// ローカルストレージから履歴を読み込む
const loadHistoryFromStorage = (): QuizSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('履歴の読み込みエラー:', error)
  }
  return []
}

// ローカルストレージに履歴を保存
const saveHistoryToStorage = (history: QuizSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('履歴の保存エラー:', error)
  }
}

function App() {
  const { currentUser, loading, loginWithGoogle, loginWithEmail, signUpWithEmail, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [mode, setMode] = useState<'menu' | 'quiz' | 'result' | 'history' | 'mypage'>('menu')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [history, setHistory] = useState<QuizSession[]>([])
  const resultSavedRef = useRef(false)
  const [resultPageIndex, setResultPageIndex] = useState(0)

  const filteredQuestions = useMemo(() => {
    if (!selectedLevel) return []
    
    let questions = initialQuestions
    const QUESTIONS_PER_QUIZ = 10 // 1回のクイズで出題する問題数
    
    if (selectedLevel === 'random') {
      // ランダム: すべての問題から10問をランダムに選択
      questions = questions.sort(() => Math.random() - 0.5)
      return questions.slice(0, QUESTIONS_PER_QUIZ)
    } else {
      // レベル指定: そのレベルの問題から10問をランダムに選択
      questions = questions.filter((q) => q.level === selectedLevel)
      questions = questions.sort(() => Math.random() - 0.5)
      return questions.slice(0, QUESTIONS_PER_QUIZ)
    }
  }, [selectedLevel])

  const currentQuestion =
    filteredQuestions.length > 0
      ? filteredQuestions[currentQuestionIndex]
      : null

  // 履歴をローカルストレージから読み込む
  useEffect(() => {
    const loadedHistory = loadHistoryFromStorage()
    setHistory(loadedHistory)
  }, [])

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level)
    // filteredQuestionsを計算してから初期化
    let questions = initialQuestions
    let filtered = questions
    if (level === 'random') {
      filtered = questions.sort(() => Math.random() - 0.5)
    } else {
      filtered = questions.filter((q) => q.level === level).sort(() => Math.random() - 0.5)
    }
    setMode('quiz')
    setCurrentQuestionIndex(0)
    setUserAnswers(new Array(filtered.length).fill(null))
    resultSavedRef.current = false
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // すべての問題に答えたら結果画面へ
      // すべての問題に回答済みか確認
      const allAnswered = userAnswers.every((answer) => answer !== null)
      if (allAnswered) {
        setResultPageIndex(0)
        setMode('result')
      } else {
        alert('すべての問題に回答してください')
      }
    }
  }


  const handleBackToMenu = () => {
    if (mode === 'quiz' || mode === 'result') {
      setMode('menu')
      setSelectedLevel(null)
      setCurrentQuestionIndex(0)
      setUserAnswers([])
      setResultPageIndex(0)
    } else if (mode === 'mypage' || mode === 'history') {
      setMode('menu')
    } else {
      setMode('menu')
      setSelectedLevel(null)
      setCurrentQuestionIndex(0)
      setUserAnswers([])
      setResultPageIndex(0)
    }
  }

  const handleClearHistory = () => {
    if (confirm('すべての学習履歴を削除しますか？')) {
      setHistory([])
      localStorage.removeItem(STORAGE_KEY)
    }
  }


  if (mode === 'quiz' && currentQuestion) {
    const selectedAnswer = userAnswers[currentQuestionIndex]
    const isAllAnswered = userAnswers.every((answer) => answer !== null)
    
    return (
      <div className="page">
        <header className="header">
          <h1>
            {levelNames[selectedLevel!]}
          </h1>
          <p className="subtitle">
            問題 {currentQuestionIndex + 1} / {filteredQuestions.length}
          </p>
        </header>

        <main className="main">
          <div className="card quiz-card">
            <h2 className="question-text">{currentQuestion.text}</h2>

            <div className="choices-container">
              {currentQuestion.choices.map((choice, index) => {
                let buttonClass = 'choice-button'
                if (selectedAnswer === index) {
                  buttonClass += ' choice-button--selected'
                }

                return (
                  <button
                    key={index}
                    type="button"
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {choice}
                  </button>
                )
              })}
            </div>

            {selectedAnswer !== null && (
              <div className="quiz-progress">
                <p>
                  回答済み: {userAnswers.filter((a) => a !== null).length} / {filteredQuestions.length}
                </p>
                <button
                  type="button"
                  className={`button ${currentQuestionIndex < filteredQuestions.length - 1 ? 'button--primary' : 'button--score'}`}
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < filteredQuestions.length - 1
                    ? '次の問題へ'
                    : '採点する'}
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="button button--secondary"
            onClick={handleBackToMenu}
          >
            メニューに戻る
          </button>
        </main>
      </div>
    )
  }

  // 結果画面
  if (mode === 'result') {
    if (filteredQuestions.length === 0 || userAnswers.length === 0) {
      return (
        <div className="page">
          <header className="header">
            <h1>エラー</h1>
          </header>
          <main className="main">
            <div className="card">
              <p>結果を表示できませんでした。</p>
              <button
                type="button"
                className="button button--primary"
                onClick={handleBackToMenu}
              >
                メニューに戻る
              </button>
            </div>
          </main>
        </div>
      )
    }

    let correct = 0
    let wrong = 0
    const results = filteredQuestions.map((question, index) => {
      const userAnswer = userAnswers[index]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) correct++
      else wrong++
      return {
        question,
        userAnswer,
        isCorrect,
      }
    })

    // 初回表示時に履歴に保存
    const saveResultToHistory = () => {
      if (selectedLevel && !resultSavedRef.current) {
        const session: QuizSession = {
          id: Date.now().toString(),
          level: selectedLevel,
          date: new Date().toLocaleString('ja-JP'),
          totalQuestions: filteredQuestions.length,
          correctAnswers: correct,
          wrongAnswers: wrong,
        }

        setHistory((prevHistory) => {
          const newHistory = [session, ...prevHistory]
          saveHistoryToStorage(newHistory)
          return newHistory
        })
        resultSavedRef.current = true
      }
    }

    // 結果画面が表示されたときに一度だけ保存
    if (!resultSavedRef.current) {
      saveResultToHistory()
    }

    // 5問ずつ表示
    const QUESTIONS_PER_PAGE = 5
    const totalPages = Math.ceil(results.length / QUESTIONS_PER_PAGE)
    const currentPageResults = results.slice(
      resultPageIndex * QUESTIONS_PER_PAGE,
      (resultPageIndex + 1) * QUESTIONS_PER_PAGE
    )
    const hasNextPage = resultPageIndex < totalPages - 1

    const handleNextPage = () => {
      if (hasNextPage) {
        setResultPageIndex(resultPageIndex + 1)
      }
    }

    return (
      <div className="page result-page">
        <div className="result-container">
          <div className="result-main">
            <div className="result-content">
              {currentPageResults.map((result, localIndex) => {
                const globalIndex = resultPageIndex * QUESTIONS_PER_PAGE + localIndex
                return (
                  <div key={globalIndex} className="result-question-block">
                    <div className="result-question-header">
                      <h3 className="result-question-title">問題 {globalIndex + 1}</h3>
                    </div>
                    <div className="result-question-text">{result.question.text}</div>
                    <div className="result-answer-columns">
                      <div className="result-column">
                        <div className="result-column-header">あなたの回答</div>
                        <div className={`result-column-content ${result.isCorrect ? 'result-column-content--correct' : 'result-column-content--wrong'}`}>
                          {result.userAnswer !== null
                            ? result.question.choices[result.userAnswer]
                            : '未回答'}
                        </div>
                      </div>
                      <div className="result-column">
                        <div className="result-column-header">実際の回答</div>
                        <div className="result-column-content result-column-content--correct">
                          {result.question.choices[result.question.correctAnswer]}
                        </div>
                      </div>
                      <div className="result-column">
                        <div className="result-column-header">解説</div>
                        <div className="result-column-content result-column-content--explanation">
                          {result.question.explanation || (result.isCorrect ? '正解です！' : '不正解です。正しい答えを確認してください。')}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="result-sidebar">
            <div className="result-sidebar-box">
              <div className="result-sidebar-title">レベル</div>
              <div className="result-sidebar-subject">
                {levelNames[selectedLevel!]}
              </div>
            </div>

            <div className="result-sidebar-buttons">
              {hasNextPage && (
                <button
                  type="button"
                  className="result-sidebar-button"
                  onClick={handleNextPage}
                >
                  次へ
                </button>
              )}
              <button
                type="button"
                className="result-sidebar-button"
                onClick={handleBackToMenu}
              >
                ホーム
              </button>
            </div>

            <div className="result-sidebar-score">
              <div className="result-score-label">点数</div>
              <div className="result-score-value">
                {Math.round((correct / filteredQuestions.length) * 100)}点
              </div>
              <div className="result-score-detail">
                正解: {correct} / {filteredQuestions.length}
              </div>
            </div>

            <div className="result-sidebar-info">
              回答・解説
            </div>
          </div>
        </div>
      </div>
    )
  }

  // マイページ画面（学習履歴を表示）
  if (mode === 'mypage') {
    return (
      <div className="page">
        <div className="top-header">
          <div className="top-header-text">
            埼玉新聞社×城北埼玉高校フロンティアコース
          </div>
        </div>
        
        <header className="header">
          <div className="header-nav">
            <button type="button" className="nav-button" onClick={handleBackToMenu}>
              ← 戻る
            </button>
            <h1 className="main-title">マイページ</h1>
            <div style={{ width: '80px' }}></div>
          </div>
        </header>

        <main className="main">
          <div className="card">
            <div className="history-header">
              <h2 className="section-title">学習履歴</h2>
              {history.length > 0 && (
                <button
                  type="button"
                  className="button button--small button--danger"
                  onClick={handleClearHistory}
                >
                  履歴を削除
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="empty-text">まだ履歴がありません</p>
            ) : (
              <div className="history-list">
                {history.map((session) => (
                  <div key={session.id} className="history-item">
                    <div className="history-date">{session.date}</div>
                    <div className="history-stats">
                      <span className="history-stat">
                        {levelNames[session.level]}
                      </span>
                      <span className="history-stat history-stat--correct">
                        正解: {session.correctAnswers}
                      </span>
                      <span className="history-stat history-stat--wrong">
                        間違い: {session.wrongAnswers}
                      </span>
                    </div>
                    <div className="history-rate">
                      正答率:{' '}
                      {Math.round(
                        (session.correctAnswers / session.totalQuestions) * 100,
                      )}
                      %
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="button button--secondary"
            onClick={handleBackToMenu}
          >
            メニューに戻る
          </button>
        </main>
      </div>
    )
  }

  if (mode === 'history') {
    return (
      <div className="page">
        <header className="header">
          <h1>学習履歴</h1>
        </header>

        <main className="main">
          <div className="card">
            <div className="history-header">
              <h2 className="section-title">過去のセッション</h2>
              {history.length > 0 && (
                <button
                  type="button"
                  className="button button--small button--danger"
                  onClick={handleClearHistory}
                >
                  履歴を削除
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="empty-text">まだ履歴がありません</p>
            ) : (
              <div className="history-list">
                {history.map((session) => (
                  <div key={session.id} className="history-item">
                    <div className="history-date">{session.date}</div>
                    <div className="history-stats">
                      <span className="history-stat">
                        {levelNames[session.level]}
                      </span>
                      <span className="history-stat history-stat--correct">
                        正解: {session.correctAnswers}
                      </span>
                      <span className="history-stat history-stat--wrong">
                        間違い: {session.wrongAnswers}
                      </span>
                    </div>
                    <div className="history-rate">
                      正答率:{' '}
                      {Math.round(
                        (session.correctAnswers / session.totalQuestions) * 100,
                      )}
                      %
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="button button--secondary"
            onClick={handleBackToMenu}
          >
            メニューに戻る
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="top-header">
        <div className="top-header-text">
          埼玉新聞社×城北埼玉高校フロンティアコース
        </div>
      </div>
      
      <header className="header">
        <div className="header-nav">
          <button 
            type="button" 
            className="nav-button"
            onClick={() => setMode('mypage')}
          >
            マイページ
          </button>
          <h1 className="main-title">新聞を利用した学習サイト</h1>
          {loading ? (
            <button type="button" className="nav-button" disabled>
              読み込み中...
            </button>
          ) : currentUser ? (
            <button 
              type="button" 
              className="nav-button"
              onClick={() => setShowAccountModal(true)}
            >
              アカウント情報
            </button>
          ) : (
            <button 
              type="button" 
              className="nav-button"
              onClick={async () => {
                try {
                  await loginWithGoogle()
                } catch (error: any) {
                  alert(error.message || 'ログインに失敗しました')
                }
              }}
            >
              ログイン
            </button>
          )}
        </div>
      </header>

      {/* アカウント情報モーダル */}
      {showAccountModal && currentUser && (
        <div 
          className="modal-overlay"
          onClick={() => setShowAccountModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>アカウント情報</h2>
              <button
                type="button"
                onClick={() => setShowAccountModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                <strong>名前:</strong> {currentUser.displayName || '未設定'}
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                <strong>メール:</strong> {currentUser.email || '未設定'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  setShowAccountModal(false)
                  setMode('mypage')
                }}
                style={{ flex: 1 }}
              >
                マイページへ
              </button>
              <button
                type="button"
                className="button button--danger"
                onClick={async () => {
                  try {
                    await logout()
                    setShowAccountModal(false)
                    alert('ログアウトしました')
                  } catch (error) {
                    alert('ログアウトに失敗しました')
                  }
                }}
                style={{ flex: 1 }}
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="card">
          <h2 className="section-title">レベルを選ぶ</h2>
          <ul className="category-list">
            {([1, 2, 3, 'random'] as Level[]).map((level) => (
              <li key={level}>
                <button
                  type="button"
                  className="category-item"
                  onClick={() => handleLevelSelect(level)}
                >
                  {level === 'random' ? 'ランダム' : `▶${levelNames[level]}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} 学習サイト</small>
      </footer>
    </div>
  )
}

export default App
