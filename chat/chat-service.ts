/* eslint-disable */
// @ts-ignore

import type {
  ChatEvent,
  ChatEventHandler,
  ChatEventType,
  ChatMessage,
  IChatService,
  IStorage,
  MessageContentType,
  SendMessageServiceParams,
  SendTypingServiceParams,
  UpdateState,
} from "@chatscope/use-chat";
import {
  MessageDirection,
  MessageEvent,
  UserTypingEvent,
} from "@chatscope/use-chat";

interface EventHandlers {
  onMessage: ChatEventHandler<
    ChatEventType.Message,
    ChatEvent<ChatEventType.Message>
  >;
  onConnectionStateChanged: ChatEventHandler<
    ChatEventType.ConnectionStateChanged,
    ChatEvent<ChatEventType.ConnectionStateChanged>
  >;
  onUserConnected: ChatEventHandler<
    ChatEventType.UserConnected,
    ChatEvent<ChatEventType.UserConnected>
  >;
  onUserDisconnected: ChatEventHandler<
    ChatEventType.UserDisconnected,
    ChatEvent<ChatEventType.UserDisconnected>
  >;
  onUserPresenceChanged: ChatEventHandler<
    ChatEventType.UserPresenceChanged,
    ChatEvent<ChatEventType.UserPresenceChanged>
  >;
  onUserTyping: ChatEventHandler<
    ChatEventType.UserTyping,
    ChatEvent<ChatEventType.UserTyping>
  >;
  [key: string]: any;
}

export class ExampleChatService implements IChatService {
  storage?: IStorage;
  updateState: UpdateState;

  eventHandlers: EventHandlers = {
    onMessage: () => {},
    onConnectionStateChanged: () => {},
    onUserConnected: () => {},
    onUserDisconnected: () => {},
    onUserPresenceChanged: () => {},
    onUserTyping: () => {},
  };

  constructor(storage: IStorage, update: UpdateState) {
    this.storage = storage;
    this.updateState = update;

    window.addEventListener("chat-protocol", (evt: Event) => {
      const event = evt as CustomEvent;

      const {
        detail: { type },
        detail,
      } = event;

      if ("message" === type) {
        const message =
          detail.message as ChatMessage<MessageContentType.TextHtml>;

        message.direction = MessageDirection.Incoming;

        const { conversationId } = detail;

        if (this.eventHandlers.onMessage && detail.sender !== this) {
          this.eventHandlers.onMessage(
            new MessageEvent({ message, conversationId }),
          );
        }
      } else if ("typing" === type) {
        const { userId, isTyping, conversationId, content, sender } = detail;

        if (this.eventHandlers.onUserTyping && sender !== this) {
          this.eventHandlers.onUserTyping(
            new UserTypingEvent({
              userId,
              isTyping,
              conversationId,
              content,
            }),
          );
        }
      }
    });
  }

  sendMessage({ message, conversationId }: SendMessageServiceParams) {
    const messageEvent = new CustomEvent("chat-protocol", {
      detail: {
        type: "message",
        message,
        conversationId,
        sender: this,
      },
    });

    window.dispatchEvent(messageEvent);

    return message;
  }

  sendTyping({
    isTyping,
    content,
    conversationId,
    userId,
  }: SendTypingServiceParams) {
    const typingEvent = new CustomEvent("chat-protocol", {
      detail: {
        type: "typing",
        isTyping,
        content,
        conversationId,
        userId,
        sender: this,
      },
    });

    window.dispatchEvent(typingEvent);
  }

  on<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>,
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;

    if (key in this.eventHandlers) {
      this.eventHandlers[key] = evtHandler;
    }
  }

  off<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    eventHandler: ChatEventHandler<T, H>,
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
    if (key in this.eventHandlers) {
      this.eventHandlers[key] = () => {};
    }
  }
}
