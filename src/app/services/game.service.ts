import { Injectable } from '@angular/core';

interface player {
  roomId: number,
  userId: string
}

type players = player[];

@Injectable({
  providedIn: 'root',
})
export class GameService {

  constructor() { }

  private timeLeft: number = 60;
  public static playersInSession: string[] = [];
  public static score: number = 0;
  public static gameOver: boolean = false;
  public static myPlayer: string = '';
  public static drawing: boolean = false;
  public static currentDrawer: number = 0;

  initDrawer = () => {
    this.setDrawing(true);
  }

  nextDrawer = (callback: (user: string) => void ) => {
    let next = (GameService.currentDrawer + 1) % (GameService.playersInSession.length);
    console.log('[NEXT DRAWER]', GameService.playersInSession, GameService.playersInSession[next]);
    this.setDrawing(false);
    GameService.currentDrawer = next;
    callback(GameService.playersInSession[next]);
  }

  //deprecated
  addPlayer = (player: string) => {
    GameService.playersInSession.push(player);
    console.log('[PLAYER ADDED]', player);
  }

  setPlayersInSession = (players: string[]) => {
    GameService.playersInSession = players;
  }

  setMyPlayer = (me: string) => {
    GameService.myPlayer = me;
  }

  getMyPlayer = () => {
    return GameService.myPlayer;
  }

  setDrawing = (drawingState) => {
    GameService.drawing = drawingState;
  }

  removePlayer = (player: player) => {
    console.log('[PLAYER DISCONNECTED]', player);
  }

  updateScore = (newScore: number) => {
    if (GameService.score + newScore >= 10) {
      GameService.gameOver = true;
      console.log('Game Over');
    }
    GameService.score += newScore;
  }

  getTimeLeft = () => {
    return this.timeLeft;
  }

}
