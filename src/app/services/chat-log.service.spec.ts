import { TestBed } from '@angular/core/testing';

import { ChatLogService } from './chat-log.service';

describe('ChatLogService', () => {
  let service: ChatLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ChatLogService ]
    });
    service = TestBed.inject(ChatLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add new message', () => {
    let sender: string = 'Ryan';
    let msg: string = 'Hi, I\'m playing QuickDraw';
    service.addMessage({sender, message: msg});
    expect(service.getChatLog().messages).toEqual([{sender, message: msg}])
  });

});
