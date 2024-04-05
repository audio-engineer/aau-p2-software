import type { FC, ReactElement } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import type {
  IStorage,
  MessageContent,
  UpdateState,
} from "@chatscope/use-chat";
import {
  AutoDraft,
  BasicStorage,
  ChatMessage,
  ChatProvider as ChatscopeChatProvider,
  Conversation,
  ConversationRole,
  MessageContentType,
  MessageDirection,
  MessageStatus,
  Participant,
  Presence,
  TypingUsersList,
  User,
  UserStatus,
} from "@chatscope/use-chat";
import { nanoid } from "nanoid";
import { ExampleChatService } from "@/chat/chat-service";
import ChatContainer from "@/components/chat-container";

const messageIdGenerator = (): string => nanoid();
const groupIdGenerator = (): string => nanoid();

const serviceFactory = (
  storage: Readonly<IStorage>,
  updateState: UpdateState,
): ExampleChatService => {
  return new ExampleChatService(storage, updateState);
};

const stockfishStorage = new BasicStorage({
  groupIdGenerator,
  messageIdGenerator,
});

export const stockfishModel = {
  name: "Stockfish",
  avatar:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbn0p2CQByeW7xrsZPMiNoSogdUks_Um7rEDIGqh4wGQ&s",
};

export const userModel = {
  name: "User",
  avatar: "",
};

const stockfishUser = new User({
  id: stockfishModel.name,
  presence: new Presence({ status: UserStatus.Available, description: "" }),
  firstName: "",
  lastName: "",
  username: stockfishModel.name,
  email: "",
  avatar: stockfishModel.avatar,
  bio: "",
});

const userUser = new User({
  id: userModel.name,
  presence: new Presence({ status: UserStatus.Available, description: "" }),
  firstName: "",
  lastName: "",
  username: userModel.name,
  email: "",
  avatar: userModel.avatar,
  bio: "",
});

const conversation = new Conversation({
  id: "123",
  participants: [
    new Participant({
      id: stockfishModel.name,
      role: new ConversationRole([]),
    }),
    new Participant({
      id: userModel.name,
      role: new ConversationRole([]),
    }),
  ],
  unreadCounter: 0,
  typingUsers: new TypingUsersList({ items: [] }),
  draft: "",
});

stockfishStorage.addConversation(conversation);

stockfishStorage.addUser(stockfishUser);
stockfishStorage.addUser(userUser);

const initialMessage =
  "Hello, this is Stockfish. I will provide you with insightful feedback during the game!";

stockfishStorage.addMessage(
  new ChatMessage({
    id: "",
    content:
      initialMessage as unknown as MessageContent<MessageContentType.TextHtml>,
    contentType: MessageContentType.TextHtml,
    senderId: stockfishModel.name,
    direction: MessageDirection.Incoming,
    status: MessageStatus.Sent,
  }),
  "123",
);

const Chat: FC = (): ReactElement | null => {
  return (
    <ChatscopeChatProvider
      serviceFactory={serviceFactory}
      storage={stockfishStorage}
      config={{
        typingThrottleTime: 250,
        typingDebounceTime: 900,
        debounceTyping: true,
        autoDraft: AutoDraft.Save | AutoDraft.Restore,
      }}
    >
      <ChatContainer user={userUser} />
    </ChatscopeChatProvider>
  );
};

export default Chat;
