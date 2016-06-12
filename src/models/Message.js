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

  serializeToAlgolia(message){
    return {
      id: message.id,
      body: message.parts[0].body,
      conversation_id: message.conversationId
    };
  }
}

export const messageFactoryInstance = new MessageFactory();
