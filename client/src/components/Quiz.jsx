
import React, { useEffect, useMemo, useState } from 'react'
import Button from '../ui/Button.jsx'

export default function Quiz({ api, client, roomId, me }){
  const [q, setQ] = useState(null)
  const [timer, setTimer] = useState(0)
  const [number, setNumber] = useState(0)
  const [total, setTotal] = useState(0)
  const [picked, setPicked] = useState(-1)
  const [locked, setLocked] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!client) return
    const onQuestion = ({ question, number, total }) => {
      setQ(question); setNumber(number); setTotal(total)
      setPicked(-1); setLocked(false)
      setProgress(0)
    }
    const onTimer = (t) => {
      setTimer(t)
      // naive progress from 0->100
      setProgress(p => {
        if (t <= 0) return 100
        return Math.min(100, p + (100 / (t + 0.0001)))
      })
    }
    const onResults = ({ scoreboard }) => {
      api.setResults({ scoreboard })
      api.goto('results')
    }
    client.on('quiz:question', onQuestion)
    client.on('timer', onTimer)
    client.on('quiz:results', onResults)
    return () => {
      client.off('quiz:question', onQuestion)
      client.off('timer', onTimer)
      client.off('quiz:results', onResults)
    }
  }, [client])

  const answer = (index) => {
    if (locked) return
    setPicked(index)
    setLocked(true)
    client.emit('quiz:answer', { roomId, questionId: q.id, index }, (res) => {})
  }

  return (
    <div className="card">
      <div className="row" style={{alignItems:'center'}}>
        <div className="col"><h2>Question {number} / {total}</h2></div>
        <div className="col" style={{textAlign:'right'}}><div className="timer">⏱ {String(timer).padStart(2,'0')}</div></div>
      </div>
      <div className="progress" style={{margin: '8px 0 12px 0'}}><div style={{width: progress+'%'}}/></div>

      {q && (
        <>
          <h3 style={{marginTop:0}}>{q.text}</h3>
          <div className="list" style={{marginTop:12}}>
            {q.options.map((opt, idx) => (
              <div
                key={idx}
                className={`option ${picked===idx ? 'selected' : ''}`}
                onClick={() => answer(idx)}
              >
                {opt}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="row" style={{marginTop:16}}>
        <Button className="sec" onClick={()=>navigator.clipboard.writeText(roomId)}>Copy Room ID</Button>
        <span className="small" style={{alignSelf:'center'}}>Answers are locked on click. Next question auto-advances when time ends or everyone answers.</span>
      </div>
    </div>
  )
}
