import { useReducer, useState } from 'react'
import { reducer, initialState } from './game.js'
import TitleScreen from './components/TitleScreen.jsx'
import SetupScreen from './components/SetupScreen.jsx'
import RevealScreen from './components/RevealScreen.jsx'
import TalkScreen from './components/TalkScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import VoteScreen from './components/VoteScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'

// ゲーム進行中(中断確認が必要な)フェーズ
const IN_GAME = ['reveal', 'talk', 'question', 'vote']

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [confirmQuit, setConfirmQuit] = useState(false)

  const { phase } = state
  const showQuit = IN_GAME.includes(phase)

  const quit = () => {
    setConfirmQuit(false)
    dispatch({ type: 'RESET' })
  }

  return (
    <div className="app">
      {showQuit && (
        <header className="topbar">
          <button
            className="topbar__quit"
            onClick={() => setConfirmQuit(true)}
            aria-label="ゲームを中断"
          >
            ✕ 中断
          </button>
        </header>
      )}

      <main className={`app__main ${showQuit ? 'app__main--with-bar' : ''}`}>
        {phase === 'title' && (
          <TitleScreen onStart={() => dispatch({ type: 'GO_SETUP' })} />
        )}

        {phase === 'setup' && (
          <SetupScreen
            settings={state.settings}
            onChange={(payload) =>
              dispatch({ type: 'UPDATE_SETTINGS', payload })
            }
            onStart={(players) => dispatch({ type: 'START_GAME', players })}
          />
        )}

        {phase === 'reveal' && (
          <RevealScreen
            players={state.players}
            topic={state.topic}
            constraint={state.constraint}
            liarIndex={state.liarIndex}
            onDone={() => dispatch({ type: 'GO_TALK' })}
          />
        )}

        {phase === 'talk' && (
          <TalkScreen
            players={state.players}
            topic={state.topic}
            constraintActive={!!state.constraint}
            talkOrder={state.talkOrder}
            settings={state.settings}
            onDone={() => dispatch({ type: 'END_TALK' })}
          />
        )}

        {phase === 'question' && (
          <QuestionScreen
            constraintActive={!!state.constraint}
            questionTime={state.settings.questionTime}
            onDone={() => dispatch({ type: 'GO_VOTE' })}
          />
        )}

        {phase === 'vote' && (
          <VoteScreen
            players={state.players}
            onVote={(voterIndex, targetIndex) =>
              dispatch({ type: 'CAST_VOTE', voterIndex, targetIndex })
            }
            onDone={() => dispatch({ type: 'GO_RESULT' })}
          />
        )}

        {phase === 'result' && (
          <ResultScreen
            state={state}
            onReplay={() => dispatch({ type: 'REPLAY' })}
            onReset={() => dispatch({ type: 'RESET' })}
          />
        )}
      </main>

      {confirmQuit && (
        <div className="modal-overlay" onClick={() => setConfirmQuit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">ゲームを中断しますか？</h2>
            <p className="note">進行中のゲームは破棄され、タイトルに戻ります。</p>
            <div className="stack">
              <button className="btn btn--danger btn--block" onClick={quit}>
                中断してタイトルへ
              </button>
              <button
                className="btn btn--ghost btn--block"
                onClick={() => setConfirmQuit(false)}
              >
                続ける
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
