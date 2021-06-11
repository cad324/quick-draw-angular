import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopupComponent } from './components/dialog/dialog.component';
import { GameOverComponent } from './components/game-over/game-over.component';
import { GameService } from './services/game.service';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GameService, MatDialog, WebSocketService]
})

export class AppComponent {

  constructor(
    private webSocket: WebSocketService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      width: '250px'
    });

    this.webSocket.gameOver.subscribe({
      next(data) {
        openGameOverDialog(data);
      }
    })

    const openGameOverDialog = (data) => {
      let tempData: object = data;
      const MAX_SCORE = Math.max(...Object.values(tempData));
      GameOverComponent.max = MAX_SCORE;
      this.dialog.open(GameOverComponent, {
        width: '250px',
        data
      });
      console.log('[GAME OVER DATA]', data);
      GameService.gameOver = true;
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
