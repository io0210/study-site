import { useState, useMemo, useEffect } from 'react'

type Subject = 'kokugo' | 'shakai'

type Question = {
  id: number
  subject: Subject
  text: string
  choices: string[]
  correctAnswer: number
}

type QuizSession = {
  id: string
  subject: Subject
  date: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
}

const initialQuestions: Question[] = [
  {
    id: 1,
    subject: 'kokugo',
    text: '「走る」の敬語（丁寧語）はどれですか？',
    choices: ['走ります', 'お走りになる', '走られる', '走る'],
    correctAnswer: 0,
  },
  {
    id: 2,
    subject: 'kokugo',
    text: '「食べる」の尊敬語はどれですか？',
    choices: ['食べる', 'お食べになる', '食べられる', '食べます'],
    correctAnswer: 1,
  },
  {
    id: 3,
    subject: 'shakai',
    text: '日本の首都はどこですか？',
    choices: ['大阪', '名古屋', '東京', '横浜'],
    correctAnswer: 2,
  },
  {
    id: 4,
    subject: 'shakai',
    text: '日本で一番長い川はどれですか？',
    choices: ['利根川', '信濃川', '石狩川', '天塩川'],
    correctAnswer: 1,
  },
]

const subjectNames: Record<Subject, string> = {
  kokugo: '国語',
  shakai: '社会',
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
  const [subject, setSubject] = useState<Subject>('kokugo')
  const [mode, setMode] = useState<'menu' | 'quiz' | 'history'>('menu')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizResults, setQuizResults] = useState<{
    correct: number
    wrong: number
  }>({ correct: 0, wrong: 0 })
  const [history, setHistory] = useState<QuizSession[]>([])

  const filteredQuestions = useMemo(
    () => initialQuestions.filter((q) => q.subject === subject),
    [subject],
  )

  const currentQuestion =
    filteredQuestions.length > 0
      ? filteredQuestions[currentQuestionIndex]
      : null

  // 履歴をローカルストレージから読み込む
  useEffect(() => {
    const loadedHistory = loadHistoryFromStorage()
    setHistory(loadedHistory)
  }, [])

  // 教科が変わったときに履歴を再読み込み
  useEffect(() => {
    const loadedHistory = loadHistoryFromStorage()
    setHistory(loadedHistory)
  }, [subject])

  const handleStartQuiz = () => {
    if (filteredQuestions.length === 0) {
      alert('この教科には問題がありません')
      return
    }
    setMode('quiz')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizResults({ correct: 0, wrong: 0 })
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === currentQuestion?.correctAnswer
    setQuizResults((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // クイズ終了
      const session: QuizSession = {
        id: Date.now().toString(),
        subject,
        date: new Date().toLocaleString('ja-JP'),
        totalQuestions: filteredQuestions.length,
        correctAnswers: quizResults.correct,
        wrongAnswers: quizResults.wrong,
      }

      // ローカルストレージに保存
      const newHistory = [session, ...history]
      setHistory(newHistory)
      saveHistoryToStorage(newHistory)

      setMode('menu')
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleBackToMenu = () => {
    setMode('menu')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizResults({ correct: 0, wrong: 0 })
  }

  const handleClearHistory = () => {
    if (confirm('すべての学習履歴を削除しますか？')) {
      setHistory([])
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const subjectHistory = useMemo(
    () => history.filter((h) => h.subject === subject),
    [history, subject],
  )

  const totalStats = useMemo(() => {
    return subjectHistory.reduce(
      (sum, session) => ({
        totalQuestions: sum.totalQuestions + session.totalQuestions,
        totalCorrect: sum.totalCorrect + session.correctAnswers,
        totalWrong: sum.totalWrong + session.wrongAnswers,
      }),
      { totalQuestions: 0, totalCorrect: 0, totalWrong: 0 },
    )
  }, [subjectHistory])

  if (mode === 'quiz' && currentQuestion) {
    return (
      <div className="page">
        <header className="header">
          <h1>クイズ - {subjectNames[subject]}</h1>
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
                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass += ' choice-button--correct'
                  } else if (
                    index === selectedAnswer &&
                    index !== currentQuestion.correctAnswer
                  ) {
                    buttonClass += ' choice-button--wrong'
                  }
                } else if (selectedAnswer === index) {
                  buttonClass += ' choice-button--selected'
                }

                return (
                  <button
                    key={index}
                    type="button"
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    {choice}
                  </button>
                )
              })}
            </div>

            {showResult && (
              <div className="result-message">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <p className="result-message--correct">✓ 正解です！</p>
                ) : (
                  <p className="result-message--wrong">
                    ✗ 不正解です。正解は「
                    {currentQuestion.choices[currentQuestion.correctAnswer]}」
                    です。
                  </p>
                )}
                <div className="quiz-progress">
                  <p>
                    正解: {quizResults.correct} / 間違い: {quizResults.wrong}
                  </p>
                </div>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < filteredQuestions.length - 1
                    ? '次の問題へ'
                    : '結果を見る'}
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

  if (mode === 'history') {
    return (
      <div className="page">
        <header className="header">
          <h1>学習履歴 - {subjectNames[subject]}</h1>
        </header>

        <main className="main">
          <div className="card">
            <h2 className="section-title">総合統計</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{totalStats.totalQuestions}</div>
                <div className="stat-label">総問題数</div>
              </div>
              <div className="stat-item stat-item--correct">
                <div className="stat-value">{totalStats.totalCorrect}</div>
                <div className="stat-label">正解数</div>
              </div>
              <div className="stat-item stat-item--wrong">
                <div className="stat-value">{totalStats.totalWrong}</div>
                <div className="stat-label">間違い数</div>
              </div>
              <div className="stat-item stat-item--rate">
                <div className="stat-value">
                  {totalStats.totalQuestions > 0
                    ? Math.round(
                        (totalStats.totalCorrect / totalStats.totalQuestions) *
                          100,
                      )
                    : 0}
                  %
                </div>
                <div className="stat-label">正答率</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="history-header">
              <h2 className="section-title">過去のセッション</h2>
              {subjectHistory.length > 0 && (
                <button
                  type="button"
                  className="button button--small button--danger"
                  onClick={handleClearHistory}
                >
                  履歴を削除
                </button>
              )}
            </div>
            {subjectHistory.length === 0 ? (
              <p className="empty-text">まだ履歴がありません</p>
            ) : (
              <div className="history-list">
                {subjectHistory.map((session) => (
                  <div key={session.id} className="history-item">
                    <div className="history-date">{session.date}</div>
                    <div className="history-stats">
                      <span className="history-stat history-stat--correct">
                        正解: {session.correctAnswers}
                      </span>
                      <span className="history-stat history-stat--wrong">
                        間違い: {session.wrongAnswers}
                      </span>
                      <span className="history-stat">
                        合計: {session.totalQuestions}
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
      <header className="header">
        <h1>教科別 学習クイズ</h1>
        <p className="subtitle">教科を選んで、クイズにチャレンジしよう</p>
      </header>

      <main className="main">
        <section className="card">
          <h2 className="section-title">教科を選ぶ</h2>
          <div className="tab-list" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={subject === 'kokugo'}
              className={`tab ${subject === 'kokugo' ? 'tab--active' : ''}`}
              onClick={() => setSubject('kokugo')}
            >
              国語
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={subject === 'shakai'}
              className={`tab ${subject === 'shakai' ? 'tab--active' : ''}`}
              onClick={() => setSubject('shakai')}
            >
              社会
            </button>
          </div>
        </section>

        <section className="menu-grid">
          <div className="card menu-card">
            <h2 className="section-title">クイズを始める</h2>
            <p className="card-description">
              {subjectNames[subject]}の問題にチャレンジします
            </p>
            <p className="question-count">
              問題数: {filteredQuestions.length}問
            </p>
            <button
              type="button"
              className="button button--primary"
              onClick={handleStartQuiz}
              disabled={filteredQuestions.length === 0}
            >
              クイズ開始
            </button>
          </div>

          <div className="card menu-card">
            <h2 className="section-title">学習履歴</h2>
            <p className="card-description">
              {subjectNames[subject]}の過去の成績を確認します
            </p>
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="quick-stat-label">総問題数:</span>
                <span className="quick-stat-value">{totalStats.totalQuestions}</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-label">正答率:</span>
                <span className="quick-stat-value">
                  {totalStats.totalQuestions > 0
                    ? Math.round(
                        (totalStats.totalCorrect / totalStats.totalQuestions) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setMode('history')}
            >
              履歴を見る
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} 学習サイト</small>
      </footer>
    </div>
  )
}

export default App
