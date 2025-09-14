import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, Shield, Users, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ContactRequest {
  id: string;
  name: string;
  contact: string;
  message: string | null;
  created_at: string;
}

export default function AdminPanel() {
  const { userRole } = useAuth();
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userRole === 'admin') {
      fetchContacts();
    }
  }, [userRole]);

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Доступ запрещен</CardTitle>
            <CardDescription>
              У вас нет прав доступа к административной панели
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Административная панель</h1>
            <p className="text-muted-foreground">Управление заявками и пользователями</p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.length}</div>
                <p className="text-xs text-muted-foreground">
                  Общее количество заявок
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">За сегодня</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {contacts.filter(contact => 
                    new Date(contact.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Новые заявки сегодня
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ваша роль</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge variant="default">Администратор</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Полный доступ к системе
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Заявки на связь</CardTitle>
            <CardDescription>
              Список всех поступивших заявок от клиентов
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Заявок пока нет</h3>
                <p className="text-muted-foreground">
                  Новые заявки будут отображаться здесь
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Контакт</TableHead>
                    <TableHead>Сообщение</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.contact}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {contact.message || 'Нет сообщения'}
                      </TableCell>
                      <TableCell>
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
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}