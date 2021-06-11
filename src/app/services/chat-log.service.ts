import { Inject, Injectable } from '@angular/core';

export interface message {
  sender: string,
  message: string
}

interface chatLog {
  roomId: number,
  messages: message[]
}

@Injectable()
export class ChatLogService {

  constructor() { }

  private chatHistory: chatLog = {
    roomId: 0,
    messages: []
  }

  addMessage = (msg: message) => {
    this.chatHistory.messages.push(msg);
    console.log('[CHAT HISTORY]', this.chatHistory);
  }

  getChatLog = () => {
    return this.chatHistory;
  }

}
