import { Component, OnInit, ElementRef } from '@angular/core';
import * as p5 from 'p5';
import { GameService } from 'src/app/services/game.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  providers: [WebSocketService, GameService]
})
export class CanvasComponent implements OnInit {

  constructor(
    private el: ElementRef,
    private webSocket: WebSocketService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    new p5(p => {

      let eraseBtn: p5;
      let blackSelect: p5;
      let redSelect: p5;
      let greenSelect: p5;
      let yellowSelect: p5;
      let blueSelect: p5;
      let thicknessSlider: p5;
      let thickness: number = 2;
      let fill: string | number = 0;
      let drawPanel: p5[] = [eraseBtn, blackSelect, redSelect, greenSelect,
        yellowSelect, blueSelect, thicknessSlider];

      p.setup = () => {

        p.createCanvas(640, 410);
        this.webSocket.newDrawing.subscribe({
          next(data: any) {
            p.strokeWeight(data.strokeWeight);
            p.stroke(data.fill);
            p.line(data.x, data.y, data.px, data.py);
          }
        });

        this.webSocket.screenCleared.subscribe({
          next() {
            p.erase();
            p.rect(0, 0, p.width, p.height);
            p.noErase();
          }
        });

        this.webSocket.erasedDrawing.subscribe({
          next(data: any) {
            p.erase();
            p.strokeWeight(data.strokeWeight);
            p.line(data.x, data.y, data.px, data.py);
            p.noErase();
          }
        });

        this.webSocket.newTurn.subscribe({
          next() {
            p.erase();
            p.rect(0, 0, p.width, p.height);
            p.noErase();
          }
        });

        eraseBtn = p.createButton('CLEAR');

        blackSelect = p.createSpan('');
        blackSelect.position(100, p.height+10);
        blackSelect.id('black-select');
        blackSelect.addClass('selected-color');

        greenSelect = p.createSpan('');
        greenSelect.position(150, p.height+10);
        greenSelect.id('green-select');

        blueSelect = p.createSpan('');
        blueSelect.position(200, p.height+10);
        blueSelect.id('blue-select');

        redSelect = p.createSpan('');
        redSelect.position(250, p.height+10);
        redSelect.id('red-select');

        yellowSelect = p.createSpan('');
        yellowSelect.position(300, p.height+10);
        yellowSelect.id('yellow-select');

        [blackSelect, yellowSelect, greenSelect, blueSelect, redSelect]
          .map(colorEl => {
            colorEl.mouseClicked(() => p.selectColor(colorEl));
          });

        thicknessSlider = p.createSlider(1, 20, 2, 1);
        thicknessSlider.position(350, p.height+10);

        eraseBtn.position(0, p.height+20);
        eraseBtn.mousePressed(p.clearScreen);

        drawPanel = [eraseBtn, blackSelect, redSelect, greenSelect,
          yellowSelect, blueSelect, thicknessSlider];

        p.hidePanel(drawPanel);
      }

      p.hidePanel = (drawPanel: p5.Element[]) => {
        if (!drawPanel[0].hasClass('hide')) {
          drawPanel.map(el => {
            el.addClass('hide');
          });
        }
      }

      p.showPanel = (drawPanel: p5.Element[]) => {
        if (drawPanel[0].hasClass('hide')) {
          drawPanel.map(el => {
            el.removeClass('hide');
          });
        }
      }

      p.clearScreen = () => {
        p.erase();
        this.webSocket.clearCanvas();
        p.rect(0, 0, p.width, p.height);
        p.noErase();
        console.log('[ERASING]');
      }

      p.selectColor = (el: p5) => {
        [[blackSelect, 0], [yellowSelect, 'yellow'], 
        [greenSelect, 'green'], [blueSelect, 'blue'],
        [redSelect, 'red']]
          .filter(color => color[0] != el)
          .map(colorEl => {
            colorEl[0].removeClass('selected-color');
          });

        [[blackSelect, 0], [yellowSelect, 'yellow'], 
        [greenSelect, 'green'], [blueSelect, 'blue'],
        [redSelect, 'red']]
          .filter(color => color[0] === el)
          .map(colorEl => {
            colorEl[0].addClass('selected-color');
            fill = colorEl[1];
          });
      }

      p.draw = () => {
        if (GameService.drawing) {
          p.showPanel(drawPanel);
          thickness = thicknessSlider.value();
          if (p.mouseIsPressed) {
            if (p.mouseButton == p.LEFT) {
              p.strokeWeight(thickness);
              p.stroke(fill);
              p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
              this.webSocket.updateCanvasDraw({
                x: p.mouseX,
                y: p.mouseY,
                px: p.pmouseX,
                py: p.pmouseY,
                fill: fill,
                strokeWeight: thickness
              });
            } else if (p.mouseButton == p.RIGHT) {
              p.erase();
              p.strokeWeight(10);
              p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
              this.webSocket.eraseOnCanvas({
                x: p.mouseX,
                y: p.mouseY,
                px: p.pmouseX,
                py: p.pmouseY,
                fill: 255,
                strokeWeight: 10
              })
              p.noErase();
            }
          }
        } else {
          p.hidePanel(drawPanel);
        }
      };
    }, this.el.nativeElement);
  }

}
