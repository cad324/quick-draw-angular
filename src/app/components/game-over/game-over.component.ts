import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GameService } from 'src/app/services/game.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

type DialogData = playerScore[];
interface playerScore {
  player: string,
  score: number
}

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css'],
  providers: [GameService, MatDialog, WebSocketService]
})
export class GameOverComponent {

  public scores: playerScore[] = [];
  public static max: number = 0;
  public gameOverComponent = GameOverComponent;

  constructor(
    public dialogRef: MatDialogRef<GameOverComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.dialogRef.disableClose = true;
    }

}
