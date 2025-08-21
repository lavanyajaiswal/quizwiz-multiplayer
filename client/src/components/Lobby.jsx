
import React, { useEffect, useState } from 'react'
import Button from '../ui/Button.jsx'

const LANGS = ["java","cpp","python","react","javascript","node","mysql"]

export default function Lobby({ api, client, roomId, me, language }){
  const [state, setState] = useState({ id: roomId, players: [], language, phase: 'lobby' })
  const [selected, setSelected] = useState(language)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!client) return
    const onLobby = (payload) => setState(payload)
    const onQuestion = () => api.goto('quiz')
    client.on('lobby:update', onLobby)
    client.on('quiz:question', onQuestion) // navigate when quiz starts
    return () => {
      client.off('lobby:update', onLobby)
      client.off('quiz:question', onQuestion)
    }
  }, [client])

  const copyId = async () => {
    await navigator.clipboard.writeText(state.id)
    setCopied(true)
    setTimeout(()=>setCopied(false), 1200)
  }

  const setLanguage = () => {
    if (!me.isHost) return
    client.emit('room:setLanguage', { roomId, language: selected }, (res) => {
      // ignore errors in UI for brevity
    })
  }

  const start = () => {
    if (!me.isHost) return
    client.emit('quiz:start', { roomId }, (res) => {})
  }

  return (
    <div className="card">
      <h2>Lobby — Room <span className="badge">{state.id}</span></h2>
      <p>Share the Room ID with friends. Players will appear below as they join.</p>

      <div className="row" style={{alignItems:'flex-end'}}>
        <div className="col">
          <label className="small">Language (host only)</label>
          <div className="row">
            <select disabled={!me.isHost} value={selected} onChange={e=>setSelected(e.target.value)}>
              {LANGS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
            <Button className="sec" disabled={!me.isHost} onClick={setLanguage}>Apply</Button>
          </div>
          <p className="small" style={{marginTop:6}}>Current: <strong>{state.language?.toUpperCase()}</strong></p>
        </div>
        <div className="col">
          <div className="row">
            <Button onClick={start} disabled={!me.isHost}>Start Quiz</Button>
            <Button className="sec" onClick={copyId}>{copied ? "Copied!" : "Copy Room ID"}</Button>
            <Button className="sec" onClick={()=>api.goto('home')}>Leave</Button>
          </div>
        </div>
      </div>

      <h3 style={{marginTop:16}}>Players</h3>
      <div className="list">
        {state.players.map((p, i) => (
          <div key={i} className="player">
            <div>{p.name} {p.isHost && <span className="badge">HOST</span>}</div>
            <div className="small">Score: {p.score}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
