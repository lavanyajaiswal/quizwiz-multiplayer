
import React, { useState } from 'react'
import Button from '../ui/Button.jsx'
import { createSocket } from '../socket.js'

const LANGS = ["java","cpp","python","react","javascript","node","mysql"]

export default function Home({ api }){
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [language, setLanguage] = useState('java')
  const [duration, setDuration] = useState(15)
  const [client, setClient] = useState(null)
  const [error, setError] = useState('')

  function ensureClient(){
    if (client) return client
    const s = createSocket()
    setClient(s)
    api.setClient(s)
    return s
  }

  const createRoom = () => {
    setError('')
    const s = ensureClient()
    if (!name) return setError('Please enter your name')
    s.emit('room:create', { name, language, questionDuration: duration }, (res) => {
      if (!res.ok) return setError(res.error)
      api.setRoomId(res.roomId)
      api.setMe({ name, isHost: true })
      api.setLanguage(language)
      api.goto('lobby')
    })
  }

  const joinRoom = () => {
    setError('')
    const s = ensureClient()
    if (!name) return setError('Please enter your name')
    if (!roomId) return setError('Enter a room ID to join')
    s.emit('room:join', { roomId, name }, (res) => {
      if (!res.ok) return setError(res.error)
      api.setRoomId(roomId)
      api.setMe({ name, isHost: false })
      api.goto('lobby')
    })
  }

  return (
    <div className="card hero">
      <div className="row" style={{alignItems:'center'}}>
        <div className="col">
          <span className="badge">Real-time</span>
          <h1>QuizWiz Multiplayer</h1>
          <p>Play fast-paced coding quizzes with friends. Create private rooms, pick a language, and race against the timer — scores update with time bonuses!</p>
          <div className="features">
            <div className="feature"><h3>⏱ Per-question Timer</h3><p>Beat the clock for bonus points.</p></div>
            <div className="feature"><h3>🛖 Private Rooms</h3><p>Share a 6-digit Room ID to invite friends.</p></div>
            <div className="feature"><h3>🧠 Language Packs</h3><p>Java, C++, Python, React, JS, Node, MySQL.</p></div>
            <div className="feature"><h3>🏆 Animated Results</h3><p>Celebrate winners with flair.</p></div>
          </div>
        </div>
        <div className="col">
          <div className="card" style={{marginTop:12}}>
            <h2>Get Started</h2>
            <div className="row">
              <div className="col">
                <label className="small">Your Name</label>
                <input placeholder="e.g. Anjali" value={name} onChange={e=>setName(e.target.value)} />
              </div>
              <div className="col">
                <label className="small">Room ID (to join)</label>
                <input placeholder="e.g. 123456" value={roomId} onChange={e=>setRoomId(e.target.value)} />
              </div>
            </div>
            <div className="row" style={{marginTop:8}}>
              <div className="col">
                <label className="small">Language (host only)</label>
                <select value={language} onChange={e=>setLanguage(e.target.value)}>
                  {LANGS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="col">
                <label className="small">Seconds per question</label>
                <input type="number" min="5" max="60" value={duration} onChange={e=>setDuration(Number(e.target.value))} />
              </div>
            </div>
            <div className="row" style={{marginTop:12}}>
              <Button onClick={createRoom}>Create Room</Button>
              <Button className="sec" onClick={joinRoom}>Join Room</Button>
              <Button className="sec" onClick={()=>{navigator.clipboard.writeText(window.location.href)}}>Copy App Link</Button>
            </div>
            {error && <p style={{color:'salmon', marginTop:10}}>{error}</p>}
            <p className="small" style={{marginTop:10}}>Tip: Only the room creator controls the language. Others inherit it automatically.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
