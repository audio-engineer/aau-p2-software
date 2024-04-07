import type { FC, ReactElement } from "react";
import { useContext } from "react";
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
import { ChatService } from "@/chat/chat-service";
import Chat from "@/components/chat";
import AuthenticationContext from "@/app/authentication-context";

interface ChatProviderProps {
  readonly fen: string;
  readonly legalMoveCount: number;
}

const messageIdGenerator = (): string => nanoid();
const groupIdGenerator = (): string => nanoid();

const serviceFactory = (
  storage: Readonly<IStorage>,
  updateState: UpdateState,
): ChatService => {
  return new ChatService(storage, updateState);
};

const userStorage = new BasicStorage({
  groupIdGenerator,
  messageIdGenerator,
});

const stockfishUser = new User({
  id: "Stockfish",
  presence: new Presence({ status: UserStatus.Available, description: "" }),
  firstName: "",
  lastName: "",
  username: "Stockfish",
  email: "",
  avatar:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbn0p2CQByeW7xrsZPMiNoSogdUks_Um7rEDIGqh4wGQ&s",
  bio: "",
});

const initialMessage =
  "Hello, this is Stockfish. I will provide you with insightful feedback during the game!";

userStorage.addUser(stockfishUser);
userStorage.addConversation(
  new Conversation({
    id: "123",
    participants: [
      new Participant({
        id: "Stockfish",
        role: new ConversationRole([]),
      }),
    ],
    unreadCounter: 0,
    typingUsers: new TypingUsersList({ items: [] }),
    draft: "",
  }),
);

userStorage.addMessage(
  new ChatMessage({
    id: "",
    contentType: MessageContentType.TextHtml,
    status: MessageStatus.Sent,
    direction: MessageDirection.Incoming,
    senderId: "Stockfish",
    content:
      initialMessage as unknown as MessageContent<MessageContentType.TextHtml>,
  }),
  "123",
);

const ChatProvider: FC<ChatProviderProps> = ({
  fen,
  legalMoveCount,
}: ChatProviderProps): ReactElement | null => {
  const { user } = useContext(AuthenticationContext);

  if (null == user?.email) {
    return null;
  }

  const userUser = new User({
    id: user.email,
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "",
    lastName: "",
    username: user.email,
    email: user.email,
    avatar: "",
    bio: "",
  });

  return (
    <ChatscopeChatProvider
      serviceFactory={serviceFactory}
      storage={userStorage}
      config={{
        typingThrottleTime: 250,
        typingDebounceTime: 900,
        debounceTyping: true,
        autoDraft: AutoDraft.Save | AutoDraft.Restore,
      }}
    >
      <Chat user={userUser} fen={fen} legalMoveCount={legalMoveCount} />
    </ChatscopeChatProvider>
  );
};

export default ChatProvider;
