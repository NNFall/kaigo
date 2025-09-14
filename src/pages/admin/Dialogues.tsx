import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Users, Clock, Search, Eye, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface AIConversation {
  id: string;
  user_session_id: string;
  user_name: string | null;
  user_email: string | null;
  title: string | null;
  status: string;
  created_at: string;
  messages_count?: number;
  last_message?: string;
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  tokens_used?: number;
}

const Dialogues = () => {
  const { userRole } = useAuth();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userRole === 'admin') {
      fetchConversations();
    }
  }, [userRole]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select(`
          *,
          ai_messages(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get message counts and last messages
      const conversationsWithCounts = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: messagesData } = await supabase
            .from('ai_messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const { count } = await supabase
            .from('ai_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);

          return {
            ...conv,
            messages_count: count || 0,
            last_message: messagesData?.[0]?.content?.substring(0, 100) + (messagesData?.[0]?.content?.length > 100 ? '...' : '') || ''
          };
        })
      );

      setConversations(conversationsWithCounts);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить диалоги",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages((data || []) as AIMessage[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить сообщения",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      toast({
        title: "Успешно",
        description: "Диалог удален",
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить диалог",
        variant: "destructive",
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user_session_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Доступ запрещен</h2>
          <p className="text-muted-foreground">У вас нет прав для просмотра этой страницы</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Диалоги с AI</h1>
        <p className="text-muted-foreground">Управление диалогами пользователей с AI-ассистентом</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Всего диалогов</p>
                <p className="text-2xl font-bold">{conversations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Уникальных пользователей</p>
                <p className="text-2xl font-bold">
                  {new Set(conversations.map(c => c.user_session_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Сегодня</p>
                <p className="text-2xl font-bold">
                  {conversations.filter(c => 
                    new Date(c.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по диалогам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={fetchConversations} variant="outline">
          Обновить
        </Button>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle>Список диалогов</CardTitle>
          <CardDescription>
            Все диалоги пользователей с AI-ассистентом
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Диалоги не найдены' : 'Пока нет диалогов с AI-ассистентом'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
                <div key={conversation.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">
                        {conversation.title || `Диалог ${conversation.user_session_id.slice(-8)}`}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {conversation.messages_count} сообщений
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Пользователь: {conversation.user_name || 'Гость'} 
                      {conversation.user_email && ` (${conversation.user_email})`}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.last_message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(conversation.created_at), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedConversation(conversation);
                            fetchMessages(conversation.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Просмотр
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>
                            Диалог: {selectedConversation?.title || `ID ${selectedConversation?.user_session_id.slice(-8)}`}
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] pr-4">
                          {loadingMessages ? (
                            <div className="space-y-4">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex gap-3">
                                  <Skeleton className="h-8 w-8 rounded-full" />
                                  <Skeleton className="h-16 flex-1" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {messages.map((message) => (
                                <div key={message.id} className="flex gap-3">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                    message.role === 'user' 
                                      ? 'bg-blue-100 text-blue-600' 
                                      : 'bg-green-100 text-green-600'
                                  }`}>
                                    {message.role === 'user' ? '👤' : '🤖'}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">
                                        {message.role === 'user' ? 'Пользователь' : 'AI Ассистент'}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {format(new Date(message.created_at), 'HH:mm', { locale: ru })}
                                      </span>
                                      {message.tokens_used && (
                                        <Badge variant="outline" className="text-xs">
                                          {message.tokens_used} токенов
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="bg-muted p-3 rounded-lg text-sm">
                                      {message.content}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteConversation(conversation.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dialogues;