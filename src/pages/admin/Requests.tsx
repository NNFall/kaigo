import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trash2, Eye, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ContactRequest {
  id: string;
  name: string;
  contact: string;
  interested_project: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const statusMap = {
  new: { label: 'Новая', variant: 'destructive' as const },
  in_progress: { label: 'В работе', variant: 'default' as const },
  completed: { label: 'Завершено', variant: 'secondary' as const },
};

const projectMap = {
  'ai-voice-assistant': 'AI Голосовой ассистент',
  'ai-chatbot': 'AI чат-бот',
  'vr-trainer': 'VR-тренажер',
  'other': 'Другой вопрос',
};

export default function Requests() {
  const { userRole } = useAuth();
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    if (userRole === 'admin') {
      fetchContacts();
    }
  }, [userRole]);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter, projectFilter]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить заявки",
          variant: "destructive",
        });
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.message && contact.message.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    // Project filter
    if (projectFilter !== 'all') {
      filtered = filtered.filter(contact => contact.interested_project === projectFilter);
    }

    setFilteredContacts(filtered);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить статус",
          variant: "destructive",
        });
        return;
      }

      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, status: newStatus } : contact
      ));

      toast({
        title: "Успешно",
        description: "Статус заявки обновлен",
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить заявку",
          variant: "destructive",
        });
        return;
      }

      setContacts(contacts.filter(contact => contact.id !== id));
      toast({
        title: "Успешно",
        description: "Заявка удалена",
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Доступ запрещен</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка заявок...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold admin-text">Заявки</h1>
        <p className="admin-text-muted">Управление заявками клиентов</p>
      </div>

      {/* Filters */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 admin-text">
            <Filter className="w-4 h-4" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Поиск по имени, контакту или сообщению..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-admin-card border-admin-border text-admin-text placeholder:text-admin-text-muted"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-admin-card border-admin-border text-admin-text">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className="bg-admin-card border-admin-border">
                <SelectItem value="all" className="text-admin-text hover:bg-admin-sidebar">Все статусы</SelectItem>
                <SelectItem value="new" className="text-admin-text hover:bg-admin-sidebar">Новые</SelectItem>
                <SelectItem value="in_progress" className="text-admin-text hover:bg-admin-sidebar">В работе</SelectItem>
                <SelectItem value="completed" className="text-admin-text hover:bg-admin-sidebar">Завершено</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48 bg-admin-card border-admin-border text-admin-text">
                <SelectValue placeholder="Проект" />
              </SelectTrigger>
              <SelectContent className="bg-admin-card border-admin-border">
                <SelectItem value="all" className="text-admin-text hover:bg-admin-sidebar">Все проекты</SelectItem>
                <SelectItem value="ai-voice-assistant" className="text-admin-text hover:bg-admin-sidebar">AI Голосовой ассистент</SelectItem>
                <SelectItem value="ai-chatbot" className="text-admin-text hover:bg-admin-sidebar">AI чат-бот</SelectItem>
                <SelectItem value="vr-trainer" className="text-admin-text hover:bg-admin-sidebar">VR-тренажер</SelectItem>
                <SelectItem value="other" className="text-admin-text hover:bg-admin-sidebar">Другой вопрос</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="admin-text">
            Список заявок ({filteredContacts.length})
          </CardTitle>
          <CardDescription className="admin-text-muted">
            Все поступившие заявки от клиентов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 mx-auto admin-text-muted mb-4" />
              <h3 className="text-lg font-medium mb-2 admin-text">
                {contacts.length === 0 ? 'Заявок пока нет' : 'Заявки не найдены'}
              </h3>
              <p className="admin-text-muted">
                {contacts.length === 0 
                  ? 'Новые заявки будут отображаться здесь'
                  : 'Попробуйте изменить фильтры поиска'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto admin-table rounded-lg">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="admin-text font-semibold">Имя</TableHead>
                    <TableHead className="admin-text font-semibold">Контакт</TableHead>
                    <TableHead className="admin-text font-semibold">Проект</TableHead>
                    <TableHead className="admin-text font-semibold">Сообщение</TableHead>
                    <TableHead className="admin-text font-semibold">Статус</TableHead>
                    <TableHead className="admin-text font-semibold">Дата</TableHead>
                    <TableHead className="text-right admin-text font-semibold">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-admin-sidebar/50">
                      <TableCell className="font-medium admin-text">{contact.name}</TableCell>
                      <TableCell className="admin-text">{contact.contact}</TableCell>
                      <TableCell className="admin-text">
                        {contact.interested_project 
                          ? (projectMap[contact.interested_project as keyof typeof projectMap] || contact.interested_project)
                          : 'Не указан'
                        }
                      </TableCell>
                      <TableCell className="max-w-xs truncate admin-text">
                        {contact.message || 'Нет сообщения'}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={contact.status} 
                          onValueChange={(value) => updateStatus(contact.id, value)}
                        >
                          <SelectTrigger className="w-32 bg-admin-card border-admin-border">
                            <Badge variant={statusMap[contact.status as keyof typeof statusMap]?.variant || 'secondary'} className="border-admin-border">
                              {statusMap[contact.status as keyof typeof statusMap]?.label || contact.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent className="bg-admin-card border-admin-border">
                            <SelectItem value="new" className="text-admin-text hover:bg-admin-sidebar">Новая</SelectItem>
                            <SelectItem value="in_progress" className="text-admin-text hover:bg-admin-sidebar">В работе</SelectItem>
                            <SelectItem value="completed" className="text-admin-text hover:bg-admin-sidebar">Завершено</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="admin-text-muted">
                        {formatDistanceToNow(new Date(contact.created_at), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteContact(contact.id)}
                          className="text-destructive hover:text-destructive border-admin-border bg-admin-card"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}