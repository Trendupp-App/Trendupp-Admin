"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useAuthStore } from "@/store/authStore";
import { useStreamToken } from "@/hooks/useDisputes";

interface StreamChatContextType {
  client: StreamChat | null;
  isConnected: boolean;
  error: string | null;
}

const StreamChatContext = createContext<StreamChatContextType>({
  client: null,
  isConnected: false,
  error: null,
});

export function useStreamChat() {
  return useContext(StreamChatContext);
}

interface MockUser {
  id: string;
  name: string;
  image?: string;
}

interface MockMessage {
  id: string;
  text: string;
  created_at: string;
  user: MockUser;
}

interface MockChannel {
  id: string;
  state: { messages: MockMessage[] };
  watch: () => Promise<{ messages: MockMessage[] }>;
  on: (
    event: string,
    callback: (e: { message: MockMessage }) => void,
  ) => { unsubscribe: () => void };
  sendMessage: (payload: { text: string }) => Promise<{ message: MockMessage }>;
  _listener?: ((e: { message: MockMessage }) => void) | null;
}

export default function StreamChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, accessToken } = useAuthStore();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only query the stream token if we are authenticated and have user details
  const { data: tokenData, error: tokenError } = useStreamToken(
    !!accessToken && !!user,
  );

  useEffect(() => {
    if (!accessToken || !user || !tokenData) {
      // Clean up connection if credentials or token data is removed
      if (chatClient) {
        if (typeof chatClient.disconnectUser === "function") {
          chatClient.disconnectUser().then(() => {
            setChatClient(null);
            setIsConnected(false);
          });
        } else {
          Promise.resolve().then(() => {
            setChatClient(null);
            setIsConnected(false);
          });
        }
      }
      return;
    }

    const { token, apiKey } = tokenData;

    // Detect if staging backend returned mock GetStream credentials
    if (apiKey === "mock_stream_api_key" || apiKey.startsWith("mock")) {
      const mockClient = {
        connectUser: async () => {},
        disconnectUser: async () => {},
        channel: (type: string, id: string) => {
          const storageKey = `mock_chat_${id}`;

          const loadStoredMessages = (): MockMessage[] => {
            if (typeof window === "undefined") return [];
            try {
              const data = localStorage.getItem(storageKey);
              return data ? JSON.parse(data) : [];
            } catch {
              return [];
            }
          };

          const saveStoredMessages = (msgs: MockMessage[]) => {
            if (typeof window === "undefined") return;
            try {
              localStorage.setItem(storageKey, JSON.stringify(msgs));
              window.dispatchEvent(new Event("storage"));
            } catch (err) {
              console.error(err);
            }
          };

          const mockChannel: MockChannel = {
            id,
            state: { messages: loadStoredMessages() },
            watch: async () => {
              mockChannel.state.messages = loadStoredMessages();
              return { messages: mockChannel.state.messages };
            },
            on: (
              event: string,
              callback: (e: { message: MockMessage }) => void,
            ) => {
              const handleStorage = () => {
                const updated = loadStoredMessages();
                const currentIds = mockChannel.state.messages.map(
                  (m: MockMessage) => m.id,
                );
                const newMsgs = updated.filter(
                  (m: MockMessage) => !currentIds.includes(m.id),
                );
                if (newMsgs.length > 0) {
                  mockChannel.state.messages = updated;
                  newMsgs.forEach((msg: MockMessage) => {
                    callback({ message: msg });
                  });
                }
              };
              window.addEventListener("storage", handleStorage);
              mockChannel._listener = callback;
              return {
                unsubscribe: () => {
                  window.removeEventListener("storage", handleStorage);
                  mockChannel._listener = null;
                },
              };
            },
            sendMessage: async (payload: { text: string }) => {
              const current = loadStoredMessages();
              const newMessage = {
                id: `mock-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                text: payload.text,
                created_at: new Date().toISOString(),
                user: {
                  id: user.id,
                  name: `${user.firstName} ${user.lastName}`.trim(),
                  image: user.avatarUrl || undefined,
                },
              };
              current.push(newMessage);
              saveStoredMessages(current);
              mockChannel.state.messages = current;

              if (mockChannel._listener) {
                mockChannel._listener({ message: newMessage });
              }

              return { message: newMessage };
            },
          };
          return mockChannel;
        },
      };

      Promise.resolve().then(() => {
        setChatClient(mockClient as unknown as StreamChat);
        setIsConnected(true);
        setError(null);
      });
      return;
    }

    const client = StreamChat.getInstance(apiKey);

    let isSubscribed = true;

    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            image: user.avatarUrl || undefined,
          },
          token,
        );
        if (isSubscribed) {
          setChatClient(client);
          setIsConnected(true);
          setError(null);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to connect to chat server";
          setError(errorMessage);
          setIsConnected(false);
        }
      }
    };

    connect();

    return () => {
      isSubscribed = false;
      client.disconnectUser().then(() => {
        setChatClient(null);
        setIsConnected(false);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, user, tokenData]);

  // Derived error combining token fetch error and connection error
  const displayError =
    error || (tokenError ? "Could not fetch GetStream credentials" : null);

  return (
    <StreamChatContext.Provider
      value={{ client: chatClient, isConnected, error: displayError }}
    >
      {children}
    </StreamChatContext.Provider>
  );
}
