import { Component, Inject, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { WebSocketService } from 'src/app/services/web-socket.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

type DialogData = string;

@Component({
  templateUrl: './dialog.component.html',
  selector: 'app-popup',
  styleUrls: ['./dialog.component.css'],
  providers: [GameService, MatDialog, WebSocketService]
})
export class DialogPopupComponent {

  disabled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private gameService: GameService,
    private webSocket: WebSocketService) {
      this.dialogRef.disableClose = true;
    }

  join = (user: string) => {
    this.disabled = true;
    this.gameService.setMyPlayer(user);
    this.webSocket.emitJoin({
      roomId: 0,
      userId: user
    })
    this.dialogRef.close();
  } 

}
