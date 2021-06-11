import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { HeaderComponent } from './header.component';

const config: SocketIoConfig = { url: 'http://localhost:3000' };

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [ SocketIoModule.forRoot(config) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('title should be', () => {
    expect(component.title).toBe('QuickDraw');
  });

  it('gameStarted should be', () => {
    expect(component.gameStarted).toBeFalse();
  })

  it('gameStarted should be', () => {
    component.startTimer();
    expect(component.gameStarted).toBeTrue();
  })

});
