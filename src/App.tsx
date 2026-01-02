import { useState, useMemo, useEffect, useRef } from 'react'
import { useAuth } from './authContext'

type Subject = 'kokugo' | 'shakai'
type Category = 'kanji' | 'hinshi' | 'rekishi' | 'keizai'
type Level = 1 | 2 | 3 | 'random'

type Question = {
  id: number
  subject: Subject
  category: Category
  level: 1 | 2 | 3
  text: string
  choices: string[]
  correctAnswer: number
}

type QuizSession = {
  id: string
  subject: Subject
  category: Category
  level: Level
  date: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
}

const initialQuestions: Question[] = [
  // 国語 - 漢字
  {
    id: 1,
    subject: 'kokugo',
    category: 'kanji',
    level: 1,
    text: '「学校」の「校」の読み方は？',
    choices: ['こう', 'きょう', 'がく', 'まな'],
    correctAnswer: 0,
  },
  {
    id: 2,
    subject: 'kokugo',
    category: 'kanji',
    level: 1,
    text: '「読書」の「読」の部首は？',
    choices: ['言', '貝', '心', '手'],
    correctAnswer: 0,
  },
  {
    id: 3,
    subject: 'kokugo',
    category: 'kanji',
    level: 2,
    text: '「勉強」の「勉」の画数は？',
    choices: ['8画', '9画', '10画', '11画'],
    correctAnswer: 2,
  },
  {
    id: 4,
    subject: 'kokugo',
    category: 'kanji',
    level: 2,
    text: '「漢字」の「漢」の音読みは？',
    choices: ['かん', 'がん', 'はん', 'ばん'],
    correctAnswer: 0,
  },
  {
    id: 5,
    subject: 'kokugo',
    category: 'kanji',
    level: 3,
    text: '「鬱」の読み方は？',
    choices: ['うつ', 'ゆう', 'ゆ', 'う'],
    correctAnswer: 0,
  },
  {
    id: 6,
    subject: 'kokugo',
    category: 'kanji',
    level: 3,
    text: '「薔薇」の読み方は？',
    choices: ['ばら', 'はな', 'さくら', 'つばき'],
    correctAnswer: 0,
  },
  // 国語 - 品詞
  {
    id: 7,
    subject: 'kokugo',
    category: 'hinshi',
    level: 1,
    text: '「走る」の品詞は？',
    choices: ['名詞', '動詞', '形容詞', '副詞'],
    correctAnswer: 1,
  },
  {
    id: 8,
    subject: 'kokugo',
    category: 'hinshi',
    level: 1,
    text: '「美しい」の品詞は？',
    choices: ['名詞', '動詞', '形容詞', '副詞'],
    correctAnswer: 2,
  },
  {
    id: 9,
    subject: 'kokugo',
    category: 'hinshi',
    level: 1,
    text: '「本」の品詞は？',
    choices: ['名詞', '動詞', '形容詞', '副詞'],
    correctAnswer: 0,
  },
  {
    id: 10,
    subject: 'kokugo',
    category: 'hinshi',
    level: 2,
    text: '「速く」の品詞は？',
    choices: ['名詞', '動詞', '形容詞', '副詞'],
    correctAnswer: 3,
  },
  {
    id: 11,
    subject: 'kokugo',
    category: 'hinshi',
    level: 2,
    text: '「とても」の品詞は？',
    choices: ['名詞', '動詞', '形容詞', '副詞'],
    correctAnswer: 3,
  },
  {
    id: 12,
    subject: 'kokugo',
    category: 'hinshi',
    level: 3,
    text: '「勉強する」の「する」の品詞は？',
    choices: ['名詞', '動詞', '形容詞', '副詞'],
    correctAnswer: 1,
  },
  // 社会 - 歴史
  {
    id: 13,
    subject: 'shakai',
    category: 'rekishi',
    level: 1,
    text: '江戸時代が始まった年は？',
    choices: ['1600年', '1603年', '1615年', '1635年'],
    correctAnswer: 1,
  },
  {
    id: 14,
    subject: 'shakai',
    category: 'rekishi',
    level: 1,
    text: '明治維新が起こった年は？',
    choices: ['1865年', '1867年', '1868年', '1871年'],
    correctAnswer: 2,
  },
  {
    id: 15,
    subject: 'shakai',
    category: 'rekishi',
    level: 2,
    text: '第二次世界大戦が終わった年は？',
    choices: ['1943年', '1944年', '1945年', '1946年'],
    correctAnswer: 2,
  },
  {
    id: 16,
    subject: 'shakai',
    category: 'rekishi',
    level: 2,
    text: '鎌倉幕府が開かれた年は？',
    choices: ['1185年', '1192年', '1200年', '1210年'],
    correctAnswer: 1,
  },
  {
    id: 17,
    subject: 'shakai',
    category: 'rekishi',
    level: 3,
    text: '大化の改新が起こった年は？',
    choices: ['645年', '646年', '647年', '648年'],
    correctAnswer: 0,
  },
  {
    id: 18,
    subject: 'shakai',
    category: 'rekishi',
    level: 3,
    text: '応仁の乱が起こった年は？',
    choices: ['1465年', '1467年', '1469年', '1471年'],
    correctAnswer: 1,
  },
  // 社会 - 経済・政治
  {
    id: 19,
    subject: 'shakai',
    category: 'keizai',
    level: 1,
    text: '日本の国会は何院制ですか？',
    choices: ['一院制', '二院制', '三院制', '四院制'],
    correctAnswer: 1,
  },
  {
    id: 20,
    subject: 'shakai',
    category: 'keizai',
    level: 1,
    text: '日本の内閣総理大臣を選ぶのは？',
    choices: ['天皇', '国民', '国会', '内閣'],
    correctAnswer: 2,
  },
  {
    id: 21,
    subject: 'shakai',
    category: 'keizai',
    level: 2,
    text: 'GDPとは何の略ですか？',
    choices: ['国内総生産', '国民総生産', '国内総支出', '国民総支出'],
    correctAnswer: 0,
  },
  {
    id: 22,
    subject: 'shakai',
    category: 'keizai',
    level: 2,
    text: '日本の中央銀行は？',
    choices: ['三菱UFJ銀行', 'みずほ銀行', '日本銀行', '三井住友銀行'],
    correctAnswer: 2,
  },
  {
    id: 23,
    subject: 'shakai',
    category: 'keizai',
    level: 3,
    text: '消費税が導入された年は？',
    choices: ['1987年', '1988年', '1989年', '1990年'],
    correctAnswer: 2,
  },
  {
    id: 24,
    subject: 'shakai',
    category: 'keizai',
    level: 3,
    text: '日本の最高裁判所長官を任命するのは？',
    choices: ['内閣', '天皇', '国会', '最高裁判所'],
    correctAnswer: 1,
  },
]

const subjectNames: Record<Subject, string> = {
  kokugo: '国語',
  shakai: '社会',
}

const categoryNames: Record<Category, string> = {
  kanji: '漢字',
  hinshi: '品詞',
  rekishi: '歴史',
  keizai: '経済・政治',
}

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
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [mode, setMode] = useState<'menu' | 'category' | 'quiz' | 'result' | 'history' | 'mypage'>('menu')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [history, setHistory] = useState<QuizSession[]>([])
  const resultSavedRef = useRef(false)
  const [resultPageIndex, setResultPageIndex] = useState(0)

  const filteredQuestions = useMemo(() => {
    if (!selectedSubject || !selectedCategory || !selectedLevel) return []
    
    let questions = initialQuestions.filter(
      (q) => q.subject === selectedSubject && q.category === selectedCategory
    )
    
    if (selectedLevel === 'random') {
      // ランダム: そのカテゴリのすべての問題
      return questions.sort(() => Math.random() - 0.5)
    } else {
      // レベル指定
      questions = questions.filter((q) => q.level === selectedLevel)
      return questions.sort(() => Math.random() - 0.5)
    }
  }, [selectedSubject, selectedCategory, selectedLevel])

  const currentQuestion =
    filteredQuestions.length > 0
      ? filteredQuestions[currentQuestionIndex]
      : null

  // 履歴をローカルストレージから読み込む
  useEffect(() => {
    const loadedHistory = loadHistoryFromStorage()
    setHistory(loadedHistory)
  }, [])

  const handleCategorySelect = (subject: Subject, category: Category) => {
    setSelectedSubject(subject)
    setSelectedCategory(category)
    setMode('category')
  }

  const handleLevelSelect = (level: Level) => {
    if (selectedSubject && selectedCategory) {
      setSelectedLevel(level)
      // filteredQuestionsを計算してから初期化
      const questions = initialQuestions.filter(
        (q) => q.subject === selectedSubject && q.category === selectedCategory
      )
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
    if (mode === 'category') {
      setMode('menu')
      setSelectedSubject(null)
      setSelectedCategory(null)
    } else if (mode === 'quiz' || mode === 'result') {
      setMode('category')
      setSelectedLevel(null)
      setCurrentQuestionIndex(0)
      setUserAnswers([])
      setResultPageIndex(0)
    } else if (mode === 'mypage' || mode === 'history') {
      setMode('menu')
    } else {
      setMode('menu')
      setSelectedSubject(null)
      setSelectedCategory(null)
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

  // カテゴリ選択画面
  if (mode === 'category' && selectedSubject && selectedCategory) {
    const availableLevels: Level[] = [1, 2, 3, 'random']
    
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
            <h1 className="main-title">
              {subjectNames[selectedSubject]} - {categoryNames[selectedCategory]}
            </h1>
            <div style={{ width: '80px' }}></div>
          </div>
        </header>

        <main className="main">
          <div className="card">
            <h2 className="section-title">レベルを選ぶ</h2>
            <ul className="category-list">
              {availableLevels.map((level) => (
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
      </div>
    )
  }

  if (mode === 'quiz' && currentQuestion) {
    const selectedAnswer = userAnswers[currentQuestionIndex]
    const isAllAnswered = userAnswers.every((answer) => answer !== null)
    
    return (
      <div className="page">
        <header className="header">
          <h1>
            {subjectNames[selectedSubject!]} - {categoryNames[selectedCategory!]} - {levelNames[selectedLevel!]}
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
      if (selectedSubject && selectedCategory && selectedLevel && !resultSavedRef.current) {
        const session: QuizSession = {
          id: Date.now().toString(),
          subject: selectedSubject,
          category: selectedCategory,
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
                          {result.isCorrect ? '正解です！' : '不正解です。正しい答えを確認してください。'}
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
              <div className="result-sidebar-title">教科</div>
              <div className="result-sidebar-subject">
                {subjectNames[selectedSubject!]}
              </div>
              <div className="result-sidebar-category">
                {categoryNames[selectedCategory!]} - {levelNames[selectedLevel!]}
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
                        {subjectNames[session.subject]} - {categoryNames[session.category]} - {levelNames[session.level]}
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
                        {subjectNames[session.subject]} - {categoryNames[session.category]} - {levelNames[session.level]}
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
        <div className="subject-grid">
          {/* 社会セクション */}
          <section className="subject-section subject-section--shakai">
            <h2 className="subject-title subject-title--shakai">社会</h2>
            <ul className="category-list">
              <li>
                <button
                  type="button"
                  className="category-item"
                  onClick={() => handleCategorySelect('shakai', 'rekishi')}
                >
                  ▶歴史
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="category-item"
                  onClick={() => handleCategorySelect('shakai', 'keizai')}
                >
                  ▶経済・政治
                </button>
              </li>
            </ul>
          </section>

          {/* 国語セクション */}
          <section className="subject-section subject-section--kokugo">
            <h2 className="subject-title subject-title--kokugo">国語</h2>
            <ul className="category-list">
              <li>
                <button
                  type="button"
                  className="category-item"
                  onClick={() => handleCategorySelect('kokugo', 'kanji')}
                >
                  ▶漢字
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="category-item"
                  onClick={() => handleCategorySelect('kokugo', 'hinshi')}
                >
                  ▶品詞
                </button>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} 学習サイト</small>
      </footer>
    </div>
  )
}

export default App
