import type { FC, ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { userModel } from "@/components/chat";

interface ChatContainerProperties {
  readonly user: User;
}

const ChatContainer: FC<ChatContainerProperties> = ({
  user,
}: ChatContainerProperties): ReactElement | null => {
  const {
    currentMessages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    setCurrentUser,
    getUser,
  } = useChat();

  useEffect(() => {
    setCurrentUser(user);
  }, [user, setCurrentUser]);

  useEffect(() => {
    setActiveConversation("123");
  }, []);

  const [currentUserAvatar, currentUserName] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (activeConversation && 0 < activeConversation.participants.length) {
      const activeUser = getUser(activeConversation.participants["0"].id);

      if (activeUser) {
        return [<Avatar src={activeUser.avatar} />, activeUser.username];
      }
    }

    return [undefined, undefined];
  }, [activeConversation, getUser]);

  const [input, setInput] = useState("");

  const onChangeHandler = (textContent: string): void => {
    setInput(textContent);
  };

  const handleSend = (text: string): void => {
    const currentUserId = userModel.name;

    const message = new ChatMessage({
      id: "",
      content: text as unknown as MessageContent<MessageContentType.TextHtml>,
      contentType: MessageContentType.TextHtml,
      senderId: currentUserId,
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent,
    });

    sendMessage({
      message,
      conversationId: activeConversation.id,
      senderId: currentUserId,
    });

    setInput("");
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

  return (
    <MainContainer style={{ height: "100%" }}>
      <ChatscopeChatContainer style={{ height: "100%" }}>
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
          value={input}
          onChange={onChangeHandler}
          onSend={handleSend}
          disabled={!activeConversation}
          attachButton={false}
          placeholder="Type here..."
        />
      </ChatscopeChatContainer>
    </MainContainer>
  );
};

export default ChatContainer;
