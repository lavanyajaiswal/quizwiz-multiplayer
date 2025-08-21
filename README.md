
# QuizWiz Multiplayer (React + Socket.IO)

A real-time multiplayer quiz platform with:
- Private rooms (6-digit room ID)
- Host-only language selection (Java, C++, Python, React, JavaScript, Node, MySQL)
- Per-question timer with time bonus
- Animated winner screen
- Clean, colorful modern CSS UI

## Project Structure
```
quizwiz-multiplayer/
├─ server/                  # Node + Express + Socket.IO backend
│  ├─ index.js              # room + quiz state, sockets, timers
│  ├─ questions.js          # language-based question bank
│  ├─ package.json
│  └─ README.md
├─ client/                  # React (Vite) frontend
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ package.json
│  ├─ README.md
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ styles.css
│     ├─ socket.js
│     ├─ ui/Button.jsx
│     └─ components/
│        ├─ Home.jsx
│        ├─ Lobby.jsx
│        ├─ Quiz.jsx
│        └─ Results.jsx
└─ README.md               # This file
```

## How to Run Locally

### 1) Start the server
```bash
cd server
npm install
npm start
# Server runs at http://localhost:4000
```

### 2) Start the client
Open a second terminal:
```bash
cd client
npm install
# Optional: if your server is not on localhost:4000, create .env with:
# VITE_SERVER_URL=http://YOUR-SERVER:4000
npm run dev
# Open the printed URL (e.g., http://localhost:5173)
```

### 3) Play
- On the Home page, enter your name.
- To **create**: choose language + seconds per question and click **Create Room**. Share the Room ID.
- To **join**: enter the Room ID and click **Join Room**.
- In the lobby, the **host** can change language and **Start Quiz**.
- During a question, click an option to lock your answer. Time bonus is awarded for faster correct answers.
- After the final question, results show the winner and others with animations.

## Notes
- In-memory state only. For production, persist rooms/players and add auth.
- The server enforces: only the room creator (host) can change the language and start the quiz.
- Default 6 questions per game. Adjust in `pickQuestions()` and UI as desired.
