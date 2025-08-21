
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { QUESTION_BANK } from "./questions.js";

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.json({ ok: true });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*"},
});

// --- In-memory state ---
/**
 * rooms: {
 *   [roomId]: {
 *     id,
 *     hostId,
 *     language: "java" | "cpp" | ...,
 *     players: {
 *       [socketId]: { name, score, answered: boolean, isHost: boolean }
 *     },
 *     order: number[] (question indexes),
 *     current: number (current question pointer),
 *     phase: "lobby" | "question" | "results",
 *     timer: number, // seconds left
 *     interval: NodeJS.Timer | null,
 *     questionDuration: number
 *   }
 * }
 */
const rooms = {};

function generateRoomId() {
  return Math.random().toString().slice(2, 8); // 6 digits
}

function pickQuestions(language, count=5) {
  const pool = QUESTION_BANK[language] || [];
  const idx = [...Array(pool.length).keys()];
  // shuffle
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(count, pool.length));
}

function getPublicLobbyState(room) {
  return {
    id: room.id,
    language: room.language,
    players: Object.values(room.players).map(p => ({
      name: p.name,
      score: p.score,
      isHost: p.isHost
    })),
    phase: room.phase
  };
}

function startTimer(room) {
  clearInterval(room.interval);
  room.timer = room.questionDuration;
  room.interval = setInterval(() => {
    room.timer -= 1;
    io.to(room.id).emit("timer", room.timer);
    const everyoneAnswered = Object.values(room.players).length > 0 &&
      Object.values(room.players).every(p => p.answered === true);
    if (room.timer <= 0 || everyoneAnswered) {
      clearInterval(room.interval);
      nextStep(room);
    }
  }, 1000);
}

function broadcastLobby(room) {
  io.to(room.id).emit("lobby:update", getPublicLobbyState(room));
}

function broadcastQuestion(room) {
  const qIndex = room.order[room.current];
  const q = QUESTION_BANK[room.language][qIndex];
  const sanitized = { // do not send correct answer
    id: qIndex,
    text: q.text,
    options: q.options
  };
  // reset answers
  Object.values(room.players).forEach(p => p.answered = false);
  room.phase = "question";
  io.to(room.id).emit("quiz:question", {
    question: sanitized,
    number: room.current + 1,
    total: room.order.length
  });
  startTimer(room);
}

function broadcastResults(room) {
  room.phase = "results";
  const scoreboard = Object.values(room.players)
    .map(p => ({ name: p.name, score: p.score }))
    .sort((a, b) => b.score - a.score);
  io.to(room.id).emit("quiz:results", { scoreboard });
}

function nextStep(room) {
  // move to next question or results
  room.current += 1;
  if (room.current < room.order.length) {
    broadcastQuestion(room);
  } else {
    broadcastResults(room);
  }
}

io.on("connection", (socket) => {
  // --- Create Room ---
  socket.on("room:create", ({ name, language, questionDuration=15 }, cb) => {
    const id = generateRoomId();
    const room = {
      id,
      hostId: socket.id,
      language,
      players: {},
      order: pickQuestions(language, 6),
      current: -1,
      phase: "lobby",
      timer: 0,
      interval: null,
      questionDuration: Math.max(5, Math.min(60, questionDuration))
    };
    room.players[socket.id] = { name, score: 0, answered: false, isHost: true };
    rooms[id] = room;
    socket.join(id);
    cb && cb({ ok: true, roomId: id });
    broadcastLobby(room);
  });

  // --- Join Room ---
  socket.on("room:join", ({ roomId, name }, cb) => {
    const room = rooms[roomId];
    if (!room) return cb && cb({ ok: false, error: "Room not found." });
    if (room.phase !== "lobby") return cb && cb({ ok: false, error: "Quiz already started." });
    room.players[socket.id] = { name, score: 0, answered: false, isHost: false };
    socket.join(roomId);
    cb && cb({ ok: true, roomId });
    broadcastLobby(room);
  });

  // --- Host: set language (only allowed in lobby) ---
  socket.on("room:setLanguage", ({ roomId, language }, cb) => {
    const room = rooms[roomId];
    if (!room) return cb && cb({ ok: false, error: "Room not found." });
    if (socket.id !== room.hostId) return cb && cb({ ok: false, error: "Only host can set language." });
    if (room.phase !== "lobby") return cb && cb({ ok: false, error: "Cannot change language after start." });
    room.language = language;
    room.order = pickQuestions(language, 6);
    cb && cb({ ok: true });
    broadcastLobby(room);
  });

  // --- Host: start quiz ---
  socket.on("quiz:start", ({ roomId }, cb) => {
    const room = rooms[roomId];
    if (!room) return cb && cb({ ok: false, error: "Room not found." });
    if (socket.id !== room.hostId) return cb && cb({ ok: false, error: "Only host can start." });
    if (room.phase !== "lobby") return cb && cb({ ok: false, error: "Already started." });
    room.current = -1;
    nextStep(room);
    cb && cb({ ok: true });
  });

  // --- Player: answer ---
  socket.on("quiz:answer", ({ roomId, questionId, index }, cb) => {
    const room = rooms[roomId];
    if (!room) return cb && cb({ ok: false, error: "Room not found." });
    if (room.phase !== "question") return cb && cb({ ok: false, error: "No active question." });
    const qIndex = room.order[room.current];
    if (qIndex !== questionId) return cb && cb({ ok: false, error: "Mismatched question." });
    const player = room.players[socket.id];
    if (!player) return cb && cb({ ok: false, error: "Not in room." });
    if (player.answered) return cb && cb({ ok: false, error: "Already answered." });
    const q = QUESTION_BANK[room.language][qIndex];
    if (q.answer === index) {
      // score: base + time bonus
      const timeBonus = Math.max(0, room.timer);
      player.score += 10 + Math.floor(timeBonus / 3);
    }
    player.answered = true;
    cb && cb({ ok: true });
  });

  socket.on("disconnect", () => {
    // find and clean player from room
    for (const [roomId, room] of Object.entries(rooms)) {
      if (room.players[socket.id]) {
        const wasHost = room.hostId === socket.id;
        delete room.players[socket.id];
        if (Object.keys(room.players).length === 0) {
          clearInterval(room.interval);
          delete rooms[roomId];
        } else {
          if (wasHost) {
            // promote first remaining player as host (lobby or ongoing)
            const newHostId = Object.keys(room.players)[0];
            room.hostId = newHostId;
            room.players[newHostId].isHost = true;
          }
          broadcastLobby(room);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`QuizWiz server running on :${PORT}`));
