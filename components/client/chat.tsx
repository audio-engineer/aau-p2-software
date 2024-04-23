"use client";

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
import type { MessageContent, User as UseChatUser } from "@chatscope/use-chat";
import {
  ChatMessage,
  MessageContentType,
  MessageDirection,
  MessageStatus,
  useChat,
} from "@chatscope/use-chat";
import type { StockfishMessageResponse } from "@/app/api/stockfish/route";
import { onChildAdded, push } from "firebase/database";
import { getMessagesRef } from "@/firebase/firebase";
import type { MatchId } from "@/types/database";
import { getLatestMoveColor, normalizeColor } from "@/utils/utils";
import { useAuthentication } from "@/contexts/authentication";
import { useMatch } from "@/contexts/match";
import Loader from "@/components/client/loader";
import { Chess } from "chess.js";

interface ChatProps {
  readonly useChatUser: UseChatUser;
}

const pushNewMessage = async (
  mid: MatchId,
  message: ChatMessage<MessageContentType>,
): Promise<void> => {
  await push(getMessagesRef(mid), {
    ...message,
  });
};

const callStockfish = async (mid: MatchId, fen: string): Promise<void> => {
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

  pushNewMessage(mid, message).catch((error: unknown) => {
    console.error(error);
  });
};

const openingMoveWasPlayed = 1;

const Chat: FC<ChatProps> = ({
  useChatUser,
}: ChatProps): ReactElement | null => {
  const { isUserLoading, user } = useAuthentication();
  const { mid, fen, player, legalMoveCount } = useMatch();

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
    setCurrentUser(useChatUser);
    setActiveConversation(mid);
  }, [mid, setActiveConversation, setCurrentUser, useChatUser]);

  useEffect(() => {
    return onChildAdded(getMessagesRef(mid), (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      const message = snapshot.val() as ChatMessage<MessageContentType>;

      let direction = MessageDirection.Outgoing;

      if (message.senderId !== user?.uid) {
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
        conversationId: mid,
        senderId: message.senderId,
      });
    });
  }, [user, mid, sendMessage]);

  useEffect(() => {
    const latestMoveColor = getLatestMoveColor(new Chess(fen).turn());

    if (
      legalMoveCount < openingMoveWasPlayed ||
      (player &&
        normalizeColor(player.color) !== normalizeColor(latestMoveColor))
    ) {
      return;
    }

    callStockfish(mid, fen).catch((error: unknown) => {
      console.error(error);
    });
  }, [fen, legalMoveCount, mid, player]);

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
        userId: useChatUser.id,
        content: "",
        throttle: true,
      });
    }
  };

  const onSendHandler = (text: string): void => {
    const message = new ChatMessage({
      id: "",
      content: text as unknown as MessageContent<MessageContentType.TextHtml>,
      contentType: MessageContentType.TextHtml,
      senderId: user?.uid ?? "",
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent,
      updatedTime: new Date(),
    });

    pushNewMessage(mid, message).catch((error: unknown) => {
      console.error(error);
    });
  };

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

  if (isUserLoading) {
    return <Loader />;
  }

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
