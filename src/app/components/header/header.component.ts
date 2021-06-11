import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [GameService, WebSocketService]
})
export class HeaderComponent implements OnInit {
  title: string = 'QuickDraw';
  time: number = 60;
  score: number = GameService.score;
  gameStarted: boolean = false;
  drawingWord: string = '';
  myTurn: boolean = false;
  winner: string = 'Nobody';
  showWord: boolean = false;
  constructor(
    private gameService: GameService,
    private webSocket: WebSocketService
  ) { }

  ngOnInit(): void {

    const setTime = (time) => {
      this.time = time;
    }

    this.webSocket.timeReceived.subscribe({
      next(time) {
        setTime(time);
      }
    });

    this.webSocket.gameStarted.subscribe({
      next() {
        setGameStarted(true);
      }
    });

    this.webSocket.gameWord.subscribe({
      next(word) {
        setGameWord(word);
        if (GameService.drawing) {
          setMyTurn(true);
        } else {
          setMyTurn(false);
        }
      }
    });

    this.webSocket.correctGuess.subscribe({
      next(winner) {
        setWinner(winner);
      }
    });

    const setWinner = (winner) => {
      this.winner = winner;
      this.showWord = true;
      this.time = 1;
      if (GameService.drawing) {
        this.gameService.updateScore(1);
        this.webSocket.emitNewScore(GameService.myPlayer);
      }
      this.score = GameService.score;
      setTimeout(() => {
        this.showWord = false;
        this.winner = "Nobody";
      }, 5000);
    }

    const setGameStarted = (b: boolean) => {
      this.gameStarted = b;
    }

    const setGameWord = (word) => {
      this.drawingWord = word;
    }

    const setMyTurn = (b: boolean) => {
      this.myTurn = b;
    }

  }

  startTimer = () => {
    if (!GameService.gameOver) {
      if (this.time === 60) this.webSocket.getGameWord();
      if (this.time > 0) {
        setTimeout(() => {
          this.time = this.time - 1;
          this.webSocket.emitNewTime(this.time);
          this.startTimer();
        }, 1000);
      } else {
        if (this.winner === 'Nobody') {
          this.webSocket.emitGuessedCorrectly('Nobody');
        }
        setTimeout(() => {
          this.gameService.nextDrawer(this.webSocket.emitNewTurn);
          this.time = 60;
          this.startTimer();
        }, 5000)
      }
    }
  }

  startGame = () => {
    this.gameStarted = true;
    this.webSocket.emitGameStarted();
    this.webSocket.emitNewTurn(GameService.myPlayer);
    this.gameService.initDrawer();
    this.startTimer();
  }

}
