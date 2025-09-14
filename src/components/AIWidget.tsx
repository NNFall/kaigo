import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import AIWidgetBubble from './AIWidgetBubble';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIWidgetProps {
  isEnabled?: boolean;
}

const AIWidget: React.FC<AIWidgetProps> = ({ isEnabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userSessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random());
  const [showBubble, setShowBubble] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 320, height: 384 });
  
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Custom hooks
  const { messages, updateMessages, extendSession } = useChatHistory(userSessionId);
  const { isRecording, isTranscribing, startRecording, stopRecording, cancelRecording } = useVoiceRecording();
  const outsideClickRef = useOutsideClick(() => {
    if (isOpen && !isRecording) {
      setIsOpen(false);
    }
  });

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: 'Привет! Я AI-ассистент Никита. Как дела? Чем могу помочь?',
        timestamp: new Date()
      };
      updateMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, updateMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  // Extend session on activity
  useEffect(() => {
    if (isOpen) {
      extendSession();
    }
  }, [isOpen, extendSession]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    updateMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: inputValue,
          conversationId,
          userSessionId,
          userName: 'Гость',
          userEmail: null
        }
      });

      if (error) {
        throw error;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, aiMessage];
      updateMessages(finalMessages);
      
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Попробуйте позже.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте позже.',
        timestamp: new Date()
      };
      const errorMessages = [...newMessages, errorMessage];
      updateMessages(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoiceClick = async () => {
    if (isRecording) {
      const transcribedText = await stopRecording();
      if (transcribedText) {
        setInputValue(transcribedText);
        // Auto-send the transcribed message
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    } else {
      await startRecording();
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowBubble(false);
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Proactive Speech Bubble */}
      {!isOpen && !showBubble && (
        <AIWidgetBubble 
          onClose={() => setShowBubble(false)}
          onOpenChat={handleOpenChat}
        />
      )}

      {/* Chat Widget Icon */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleOpenChat}
            className="h-18 w-18 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 ai-widget-pulse ai-widget-glow"
            size="icon"
          >
            <MessageCircle className="h-8 w-8 text-primary-foreground" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={outsideClickRef}
          className="fixed bottom-6 right-6 z-50 animate-scale-in"
          style={{ width: windowSize.width, height: windowSize.height }}
        >
          <Card className="h-full flex flex-col bg-background/95 backdrop-blur border shadow-xl rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary/5">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/assets/nikita-avatar.jpg" alt="Никита" />
                  <AvatarFallback className="text-xs">НК</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">AI-помощник Никита</h3>
                  <p className="text-xs text-muted-foreground">Онлайн</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-background/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm transition-all duration-200 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted text-muted-foreground border shadow-sm'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {(isLoading || isTranscribing) && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg border shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs text-muted-foreground">
                          {isTranscribing ? 'Распознаю речь...' : 'Печатает...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isRecording ? "Говорите..." : "Напишите сообщение..."}
                    disabled={isLoading || isRecording}
                    className="pr-10"
                  />
                  <Button
                    onClick={handleVoiceClick}
                    disabled={isLoading || isTranscribing}
                    size="icon"
                    variant="ghost"
                    className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 ${
                      isRecording ? 'ai-widget-recording text-white' : 'hover:bg-muted'
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim() || isRecording}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isRecording && (
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  Нажмите на микрофон еще раз, чтобы остановить запись
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIWidget;