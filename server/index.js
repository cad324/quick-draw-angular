require('dotenv').config();
const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

let selectedWordBySession = [];

let playersInSessions = [];

let playerScores = [];

const updatePlayersInSession = (player, callback) => {
    if (playersInSessions[player.roomId]) {
        playersInSessions[player.roomId].push(player.userId);
    } else {
        playersInSessions[player.roomId] = [];
        playersInSessions[player.roomId].push(player.userId);
    }
    callback(player.roomId);
}

const emitJoin = (roomId) => {
    io.sockets.emit('join', playersInSessions[roomId]);
    console.log('[EMITTING PLAYERS IN SESSION]', playersInSessions[roomId]);
}

server.listen(3000);

io.sockets.on('connection', socket => {
    console.log('[Socket connected]');

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    socket.on('clear', () => {
        socket.broadcast.emit('clear', {});
        console.log('[CLEARED]');
    });

    socket.on('erase', (data) => {
        socket.broadcast.emit('erase', data);
        console.log('[ERASED]');
    });

    socket.on('message', (data) => {
        socket.broadcast.emit('message', data);
        console.log('[MESSAGE SENT]');
    });

    socket.on('time', (data) => {
        socket.broadcast.emit('time', data);
    });

    socket.on('gameStarted', (data) => {
        socket.broadcast.emit('gameStarted', data);
    });

    socket.on('gameover', (roomId) => {
        io.sockets.emit('gameover', playerScores[roomId]);
        console.log('[GAMEOVER]');
    });

    socket.on('scoreUpdate', (data) => {
        if (playerScores[data.roomId]) {
            playerScores[data.roomId][data.user] = data.score
            if (data.score >= 10) {
                io.sockets.emit('gameover', playerScores[data.roomId]);
            }
        } else {
            playerScores[data.roomId] = {};
            playerScores[data.roomId][data.user] = data.score;
        }
    });

    socket.on('join', (player) => {
        updatePlayersInSession(player, emitJoin);
    });

    socket.on('turn', (user) => {
        io.sockets.emit('turn', (user));
    });

    socket.on('guessedCorrectly', user => {
        io.sockets.emit('guessedCorrectly', user);
    })

    socket.on('getWord', (data) => {
        try {
            const doc = yaml.load(fs.readFileSync('./game_words.yaml', 'utf8'));
            let difficultyRand = Math.floor(Math.random()*3);
            let difficultyLevel = ["easy", "medium", "difficult", "hard"][difficultyRand];
            let words = doc["pictionary"][difficultyLevel]
            let selectedWord = words[Math.floor(Math.random()*words.length)];
            io.sockets.emit('getWord', selectedWord);
            console.log('[SELECTED WORD]',  selectedWord);
            selectedWordBySession[data.roomId] = selectedWord;
        } catch (e) {
            console.log(e);
        }
    })
});
