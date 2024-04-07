import type { FC, ReactElement } from "react";
import { useCallback, useEffect, useMemo } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  Avatar,
  ChatContainer as ChatscopeChatContainer,
  ConversationHeader,
  MainContainer,
  Message,
  MessageGroup,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import type { MessageContent, User } from "@chatscope/use-chat";
import {
  ChatMessage,
  MessageContentType,
  MessageDirection,
  MessageStatus,
  useChat,
} from "@chatscope/use-chat";
import type { StockfishMessageResponse } from "@/app/api/stockfish/route";
import { onValue, ref, set } from "firebase/database";
import { database } from "@/firebase/firebase";
import { asyncEventHandler } from "@/utils/utils";

interface ChatSnapshot {
  readonly message: ChatMessage<MessageContentType>;
}

interface ChatProps {
  readonly user: User;
  readonly fen: string;
  readonly legalMoveCount: number;
}

const openingMoveWasPlayed = 1;

const Chat: FC<ChatProps> = ({
  user,
  fen,
  legalMoveCount,
}: ChatProps): ReactElement | null => {
  const {
    currentMessages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    currentMessage,
    setCurrentMessage,
    setCurrentUser,
    getUser,
    sendTyping,
  } = useChat();

  useEffect(() => {
    return () => {
      setCurrentUser(user);
    };
  }, [user, setCurrentUser]);

  useEffect(() => {
    return () => {
      setActiveConversation("123");
    };
  }, [setActiveConversation]);

  useEffect(() => {
    return onValue(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/chat`),
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const chatSnapshot = snapshot.val() as ChatSnapshot;
        const { message } = chatSnapshot;

        let direction = MessageDirection.Outgoing;

        if (message.senderId !== user.id) {
          direction = MessageDirection.Incoming;
        }

        sendMessage({
          message: new ChatMessage(
            new ChatMessage({
              id: "",
              content: message.content,
              contentType: message.contentType,
              senderId: message.senderId,
              direction,
              status: message.status,
            }),
          ),
          conversationId: "123",
          senderId: message.senderId,
        });
      },
    );
  }, [sendMessage, user.id]);

  const callStockfish = useCallback(async (): Promise<void> => {
    const response = await fetch("/api/stockfish", {
      method: "POST",
      body: JSON.stringify({ fen }),
    });

    const responseJson = (await response.json()) as StockfishMessageResponse;

    const message = new ChatMessage({
      id: "",
      content:
        responseJson.message as unknown as MessageContent<MessageContentType.TextPlain>,
      contentType: MessageContentType.TextPlain,
      senderId: "Stockfish",
      direction: MessageDirection.Incoming,
      status: MessageStatus.Sent,
      updatedTime: new Date(),
    });

    await set(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/chat`),
      {
        message,
      },
    );
  }, [fen]);

  useEffect(() => {
    if (legalMoveCount < openingMoveWasPlayed) {
      return () => {
        return;
      };
    }

    void callStockfish();

    return () => {
      return;
    };
  }, [callStockfish, legalMoveCount]);

  const [currentUserAvatar, currentUserName] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (activeConversation && 0 < activeConversation.participants.length) {
      const activeUser = getUser(activeConversation.participants["0"].id);

      if (activeUser) {
        return [
          <Avatar key={1} src={activeUser.avatar} />,
          activeUser.username,
        ];
      }
    }

    return [undefined, undefined];
  }, [activeConversation, getUser]);

  const onChangeHandler = (textContent: string): void => {
    setCurrentMessage(textContent);

    if (activeConversation) {
      sendTyping({
        conversationId: activeConversation.id,
        isTyping: true,
        userId: user.id,
        content: "",
        throttle: true,
      });
    }
  };

  const onSendHandler = asyncEventHandler(
    async (text: string): Promise<void> => {
      const message = new ChatMessage({
        id: "",
        content: text as unknown as MessageContent<MessageContentType.TextHtml>,
        contentType: MessageContentType.TextHtml,
        senderId: user.id,
        direction: MessageDirection.Outgoing,
        status: MessageStatus.Sent,
        updatedTime: new Date(),
      });

      await set(
        ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/chat`),
        {
          message,
        },
      );
    },
  );

  const getTypingIndicator = useCallback(() => {
    if (activeConversation) {
      const { typingUsers } = activeConversation;

      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      if (0 < typingUsers.length) {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const typingUserId = typingUsers.items[0].userId;

        if (activeConversation.participantExists(typingUserId)) {
          const typingUser = getUser(typingUserId);

          if (typingUser) {
            return (
              <TypingIndicator content={`${typingUser.username} is typing`} />
            );
          }
        }
      }
    }

    return undefined;
  }, [activeConversation, getUser]);

  return (
    <MainContainer>
      <ChatscopeChatContainer>
        {activeConversation && (
          <ConversationHeader>
            {currentUserAvatar}
            <ConversationHeader.Content userName={currentUserName} />
          </ConversationHeader>
        )}
        {/* TODO Move MessageList to separate FC and make currentMessages
        parameter read only */}
        {/* eslint-disable */}
        <MessageList typingIndicator={getTypingIndicator()}>
          {activeConversation &&
            currentMessages.map((messageGroup) => (
              <MessageGroup
                key={messageGroup.id}
                direction={messageGroup.direction}
              >
                <MessageGroup.Messages>
                  {messageGroup.messages.map(
                    (chatMessage: ChatMessage<MessageContentType>) => (
                      <Message
                        key={chatMessage.id}
                        model={{
                          type: "html",
                          payload: chatMessage.content,
                          direction: chatMessage.direction,
                          position: "normal",
                        }}
                      />
                    ),
                  )}
                </MessageGroup.Messages>
              </MessageGroup>
            ))}
        </MessageList>
        {/*eslint-disable*/}
        <MessageInput
          value={currentMessage}
          onChange={onChangeHandler}
          onSend={onSendHandler}
          disabled={!activeConversation}
          attachButton={false}
          placeholder="Type here..."
        />
      </ChatscopeChatContainer>
    </MainContainer>
  );
};

export default Chat;
