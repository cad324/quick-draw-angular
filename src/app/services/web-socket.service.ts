import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { GameService } from './game.service';

interface drawProps {
  x: number,
  y: number,
  px: number,
  py: number,
  fill: number | string,
  strokeWeight: number
}

interface message {
  sender: string,
  message: string
}

interface player {
  roomId: number,
  userId: string
}

@Injectable()
export class WebSocketService {

  constructor(
    private socket: Socket
  ) { }

  updateCanvasDraw = (data: drawProps) => {
    this.socket.emit('draw', data);
  }

  eraseOnCanvas = (data: drawProps) => {
    this.socket.emit('erase', data);
  }

  clearCanvas = () => {
    this.socket.emit('clear', {});
  }

  messageSent = (msg: message) => {
    this.socket.emit('message', msg);
    console.log('[MESSAGE SENT]');
  }

  emitNewTime = (time: number) => {
    this.socket.emit('time', time);
  };

  getGameWord = () => {
    this.socket.emit('getWord', {roomId: 0});
  }

  emitGameStarted = () => {
    this.socket.emit('gameStarted', {roomId: 0});
  }

  emitNewTurn = (userId: string) => {
    this.socket.emit('turn', userId);
    console.log('[EMIT NEW TURN]', userId);
  }

  emitNewScore = (user: string) => {
    this.socket.emit('scoreUpdate', {roomId: 0, user, score: GameService.score})
  }

  emitGameOver = () => {
    this.socket.emit('gameover', 0);
    console.log('[GAMEOVER]');
  }

  emitJoin = (player: player) => {
    this.socket.emit('join', player);
  }

  emitGuessedCorrectly = (user: string) => {
    this.socket.emit('guessedCorrectly', user);
  }

  gameOver = new Observable(observer => {
    this.socket.on('gameover', (data) => {
      observer.next(data);
      console.log('[GAME OVER LISTENER]', data);
    });
  })

  correctGuess = new Observable(observer => {
    this.socket.on('guessedCorrectly', (user: string) => {
      observer.next(user);
    })
  });

  newDrawing = new Observable(observer => {
    this.socket.on('draw', (data: drawProps) => {
      observer.next(data);
    });
  });

  screenCleared = new Observable(observer => {
    this.socket.on('clear', () => {
      console.log('[CLEAR RECEIVED]');
      observer.next({});
    })
  });

  erasedDrawing = new Observable(observer => {
    this.socket.on('erase', (data: drawProps) => {
      observer.next(data);
      console.log('[ERASE RECEIVED]');
    })
  });

  messageReceived = new Observable(observer => {
    this.socket.on('message', (msg: message) => {
      observer.next(msg);
      console.log('[MESSAGE RECEIVED]', msg);
    })
  });

  timeReceived = new Observable(observer => {
    this.socket.on('time', (time: number) => {
      observer.next(time);
    })
  });

  gameWord = new Observable(observer => {
    this.socket.on('getWord', (word: string) => {
      observer.next(word);
    })
  });

  gameStarted = new Observable(observer => {
    this.socket.on('gameStarted', () => {
      observer.next();
    })
  });

  newTurn = new Observable(observer => {
    this.socket.on('turn', (userId: string) => {
      observer.next(userId);
      console.log('[NewTurn]', userId);
    });
  });

  newPlayerJoined = new Observable(observer => {
    this.socket.on('join', (playersInSession: player[]) => {
      observer.next(playersInSession);
    })
  })
 
}
