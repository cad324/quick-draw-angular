import { Component, OnInit } from '@angular/core';
import { ChatLogService, message } from 'src/app/services/chat-log.service';
import { GameService } from 'src/app/services/game.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [WebSocketService, ChatLogService, GameService]
})
export class ChatComponent implements OnInit {

  constructor(
    private chatService: ChatLogService,
    private webSocket: WebSocketService,
    private gameService: GameService
  ) { }

  chat = this.chatService.getChatLog();
  selectedWord: string = '';
  scroll: number | undefined = 0;
  drawing: boolean = GameService.drawing;

  ngOnInit(): void {
    this.webSocket.messageReceived.subscribe({
      next(msg) {
        logMessage(msg);
      }
    });

    this.webSocket.gameWord.subscribe({
      next(word) {
        setSelectedWord(word);
        setDrawing(GameService.drawing);
      }
    });

    this.webSocket.newTurn.subscribe({
      next(user) {
        cpuMessage({
          sender: '',
          message: `${user} is drawing!` 
        });
        if (user === GameService.myPlayer) {
          setDrawing(true);
          console.log(`It's your turn ${user}!`);
        } else {
          setDrawing(false);
        }
      }
    });

    this.webSocket.newPlayerJoined.subscribe({
      next(players) {
        setPlayers(players);
      }
    });

    const setPlayers = (players) => {
      this.gameService.setPlayersInSession(players);
      console.log('[SETTING PLAYERS]', players);
    }

    const setDrawing = (state: boolean) => {
      this.drawing = state;
      this.gameService.setDrawing(state);
    }

    const cpuMessage = (msg: message) => {
      this.chatService.addMessage(msg);
    }

    const setSelectedWord = (word) => {
      this.selectedWord = word;
    }

    const logMessage = (msg) => {
      this.chatService.addMessage(msg);
      this.scroll = document.getElementById('chat-wrapper')?.scrollHeight;
    }

  }

  sendMessage = (message: string) => {
    let sender = GameService.myPlayer.concat(` (${GameService.score})`);
    let msg = {
      sender,
      message
    }
    this.chatService.addMessage(msg);
    this.webSocket.messageSent(msg);
    if (this.selectedWord && msg.message.toLowerCase().includes(this.selectedWord.toLowerCase())) {
      console.log('You win!', msg);
      this.webSocket.emitGuessedCorrectly(GameService.myPlayer);
      this.gameService.updateScore(2);
      this.webSocket.emitNewScore(GameService.myPlayer);
    }
    this.scroll = document.getElementById('chat-wrapper')?.scrollHeight;
    console.log('[BROADCASTING]', msg);
  }

}
