import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set gameOver to false', () => {
    expect(service.gameOver).toBeFalse();
  });5

  it('should set GameOver to true', () => {
    for (let i = 0; i < 5; i++) {
      service.updateScore(2);
    }
    expect(GameService.score).toEqual(10);
    expect(service.gameOver).toBeTrue();
  });

  it('should set MyPlayer', () => {
    service.setMyPlayer('Clive');
    expect(GameService.myPlayer).toEqual('Clive');
  });

  it('should set drawing to true', () => {
    service.setDrawing(true);
    expect(GameService.drawing).toBeTrue();
  });

  it('should set drawing to false', () => {
    service.setDrawing(false);
    expect(GameService.drawing).toBeFalse();
  });

});
