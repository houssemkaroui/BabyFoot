

let socket = new WebSocket('ws://localhost:3000');

socket.onmessage = function(event) {
  const message = JSON.parse(event.data);
  console.log(message,"messagemessage")
  switch (message.type) {
    case 'CREATE':
      addGameToList(message.game);
      break;
    case 'DELETE':
      removeGameFromList(message.id);
      break;
    case 'UPDATE':
      updateGameInList(message.game);
      break;
    case 'CHAT':
      addChatMessage(message.message);
      break;
  }
  updateGameCounter();  // Mise à jour du compteur à chaque message WebSocket pertinent
};

document.addEventListener('DOMContentLoaded', () => {
  loadGames();
});

function loadGames() {
  fetch('/games')
    .then(response => response.json())
    .then(games => {
      games.forEach(game => addGameToList(game));
      updateGameCounter();  // Mise à jour du compteur après le chargement initial
    });
}



function deleteGame(id) {
  fetch(`/games/${id}`, { method: 'DELETE' })
    .then(() => {
      removeGameFromList(id);
      updateGameCounter();  // Mise à jour du compteur après la suppression d'un jeu
    });
}

function finishGame(id) {
  fetch(`/games/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'finished' })
  })
  .then(response => response.json())
  .then(game => {
    updateGameInList(game);
    updateGameCounter();  // Mise à jour du compteur après la mise à jour d'un jeu
  });
}

function addGameToList(game) {
  const gameDiv = document.createElement('div');
  gameDiv.className = 'game';
  if (game.status === 'finished') {
    gameDiv.classList.add('finished');
  }
  gameDiv.id = `game-${game.id}`;
  gameDiv.innerHTML = `
    <span>${game.name}</span>
    <button onclick="finishGame(${game.id})">✔️</button>
    <button onclick="deleteGame(${game.id})">❌</button>
  `;
  document.getElementById('games').appendChild(gameDiv);
  document.getElementById('newGame').value = ''; // Réinitialiser l'input après ajout

}

function removeGameFromList(id) {
  const gameDiv = document.getElementById(`game-${id}`);
  if (gameDiv) {
    gameDiv.remove();
  }
}

function updateGameInList(game) {
  const gameDiv = document.getElementById(`game-${game.id}`);
  if (gameDiv) {
    gameDiv.classList.add('finished');
  }
}

function updateGameCounter() {
  const ongoingGames = document.querySelectorAll('.game:not(.finished)').length;
  document.getElementById('gameCounter').textContent = ongoingGames;
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const nickname = document.getElementById('nickname');
  if (nickname.value.trim() === '' || input.value.trim() === '') return;

  const message = {
    nickname: nickname.value,
    text: input.value
  };

  socket.send(JSON.stringify({ type: 'CHAT', message }));

  input.value = '';
}

function addChatMessage(message) {
  const messagesDiv = document.getElementById('messages');
  const messageDiv = document.createElement('div');
  messageDiv.textContent = `${message.nickname}: ${message.text}`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}