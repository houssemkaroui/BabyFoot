const express = require('express');
const pool = require('./db');
const WebSocket = require('ws');

const app = express();
const wss = new WebSocket.Server({ noServer: true });

app.use(express.static('public'));
app.use(express.json());

// Création d'une partie
app.post('/games', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query('INSERT INTO games (name, status) VALUES ($1, $2) RETURNING *', [name, 'ongoing']);
    broadcast({ type: 'CREATE', game: result.rows[0] });
    res.status(200)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

// Suppression d'une partie
app.delete('/games/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM games WHERE id = $1', [req.params.id]);
    broadcast({ type: 'DELETE', id: req.params.id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Terminaison d'une partie
app.patch('/games/:id', async (req, res) => {
  try {
    const result = await pool.query('UPDATE games SET status = $1 WHERE id = $2 RETURNING *', ['finished', req.params.id]);
    broadcast({ type: 'UPDATE', game: result.rows[0] });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupération des parties
app.get('/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gestion des WebSockets
wss.on('connection', ws => {
  ws.on('message', message => {
    const data = JSON.parse(message);
    if (data.type === 'CHAT') {
      broadcast({ type: 'CHAT', message: data.message });
    }
  });
});

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
