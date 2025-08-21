
import React, { useMemo, useState } from 'react'
import Home from './components/Home.jsx'
import Lobby from './components/Lobby.jsx'
import Quiz from './components/Quiz.jsx'
import Results from './components/Results.jsx'

export default function App(){
  const [page, setPage] = useState('home')
  const [client, setClient] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [me, setMe] = useState({ name: '' })
  const [language, setLanguage] = useState('java')
  const [results, setResults] = useState(null)

  const api = useMemo(() => ({
    goto: setPage,
    setClient,
    setRoomId,
    setMe,
    setLanguage,
    setResults
  }), [])

  return (
    <div className="container">
      {page === 'home' && <Home api={api} />}
      {page === 'lobby' && <Lobby api={api} client={client} roomId={roomId} me={me} language={language} />}
      {page === 'quiz' && <Quiz api={api} client={client} roomId={roomId} me={me} />}
      {page === 'results' && <Results api={api} results={results} />}
    </div>
  )
}
