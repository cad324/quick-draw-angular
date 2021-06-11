import { TestBed } from '@angular/core/testing';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { WebSocketService } from './web-socket.service';

const config: SocketIoConfig = { url: 'http://localhost:3000' };

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ SocketIoModule.forRoot(config) ],
      providers: [ WebSocketService ]
    });
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
