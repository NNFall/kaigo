import { useState, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  messages: Message[];
  lastActivity: number;
  sessionId: string;
}

const CHAT_HISTORY_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds
const STORAGE_KEY_PREFIX = 'aiWidget_chatHistory_';

export const useChatHistory = (currentSessionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const storageKey = `${STORAGE_KEY_PREFIX}${currentSessionId}`;

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, [currentSessionId]);

  const loadChatHistory = (): Message[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];

      const history: ChatHistory = JSON.parse(stored);
      const now = Date.now();
      
      // Check if history is still valid (within TTL)
      if (now - history.lastActivity > CHAT_HISTORY_TTL) {
        localStorage.removeItem(storageKey);
        return [];
      }

      // Convert timestamp strings back to Date objects
      const messagesWithDates = history.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      setMessages(messagesWithDates);
      return messagesWithDates;
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  };

  const saveChatHistory = (messagesToSave: Message[]) => {
    try {
      const history: ChatHistory = {
        messages: messagesToSave,
        lastActivity: Date.now(),
        sessionId: currentSessionId
      };
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const clearExpiredHistory = () => {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const history: ChatHistory = JSON.parse(stored);
              if (now - history.lastActivity > CHAT_HISTORY_TTL) {
                localStorage.removeItem(key);
              }
            }
          } catch (e) {
            // Remove invalid entries
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error clearing expired history:', error);
    }
  };

  const extendSession = () => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  };

  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    saveChatHistory(newMessages);
  };

  // Clean up expired histories on mount
  useEffect(() => {
    clearExpiredHistory();
  }, []);

  return {
    messages,
    updateMessages,
    loadChatHistory,
    extendSession,
    clearExpiredHistory
  };
};