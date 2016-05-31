export class Message {
  constructor({id, body, conversationId}) {
    this.id = id;
    this.body = body;
    this.conversationId = conversationId;
  }
}

export class MessageFactory {
  buildFromEvent(opts) {
    return new Message({
      id: opts.id,
      body: opts.body,
      conversationId: opts.conversation_id,
    });
  }
}

export const messageFactoryInstance = new MessageFactory();
