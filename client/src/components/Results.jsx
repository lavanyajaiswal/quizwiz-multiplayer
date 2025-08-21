
import React, { useEffect } from 'react'
import Button from '../ui/Button.jsx'

function Confetti(){
  useEffect(() => {
    const root = document.querySelector('.confetti')
    if (!root) return
    // spawn simple confetti
    for (let i=0;i<120;i++){
      const s = document.createElement('span')
      s.style.left = Math.random()*100 + 'vw'
      s.style.animationDelay = Math.random()*1.2 + 's'
      s.style.opacity = 0.7 + Math.random()*0.3
      root.appendChild(s)
    }
    return () => { root.innerHTML = '' }
  }, [])
  return <div className="confetti" aria-hidden="true"></div>
}

export default function Results({ api, results }){
  if (!results) return null
  const sorted = [...results.scoreboard].sort((a,b)=>b.score-a.score)
  const winner = sorted[0]
  const losers = sorted.slice(1)

  return (
    <div className="card">
      <Confetti/>
      <div className="result-card">
        <div className="trophy">🏆</div>
        <h2>Winner: {winner?.name} — {winner?.score} pts</h2>
        {!!losers.length && <p className="small">Others:</p>}
        <div className="list" style={{maxWidth:480, margin:'0 auto'}}>
          {losers.map((p,i)=>(
            <div key={i} className="player" style={{background:'rgba(245,158,11,.06)', borderColor:'rgba(245,158,11,.3)'}}>
              <div>{p.name}</div>
              <div className="small">{p.score} pts</div>
            </div>
          ))}
        </div>
        <div className="row" style={{justifyContent:'center', marginTop:16}}>
          <Button onClick={()=>api.goto('home')}>Play Again</Button>
          <Button className="sec" onClick={()=>window.location.reload()}>Reset</Button>
        </div>
      </div>
    </div>
  )
}
