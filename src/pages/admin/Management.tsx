import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Users, Key, Plus, Trash2, Shield, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

export default function Management() {
  const { userRole } = useAuth();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAdminUsers();
    }
  }, [userRole]);

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role
        `)
        .eq('role', 'admin');

      if (error) throw error;
      
      // Get profiles separately to avoid relation issues
      const adminUsersWithProfiles = await Promise.all(
        (data || []).map(async (adminUser) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', adminUser.user_id)
            .single();
          
          return {
            ...adminUser,
            profiles: profile
          };
        })
      );
      
      setAdminUsers(adminUsersWithProfiles);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список администраторов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setAddingAdmin(true);
    try {
      // Create new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Add admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', authData.user.id);

        if (roleError) throw roleError;

        toast({
          title: "Успешно",
          description: "Новый администратор добавлен",
        });

        setNewAdminEmail('');
        setNewAdminPassword('');
        fetchAdminUsers();
      }
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить администратора",
        variant: "destructive",
      });
    } finally {
      setAddingAdmin(false);
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'user' })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Права администратора отозваны",
      });

      fetchAdminUsers();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отозвать права",
        variant: "destructive",
      });
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">Доступ запрещен</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Управление</h1>
        <p className="text-muted-foreground">Настройки системы и управление доступом</p>
      </div>

      <Tabs defaultValue="admins" className="space-y-4">
        <TabsList>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Администраторы
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API-ключи
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Список администраторов</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить администратора
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить нового администратора</DialogTitle>
                        <DialogDescription>
                          Создайте учетную запись для нового администратора
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="admin-email">Email</Label>
                          <Input
                            id="admin-email"
                            type="email"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            placeholder="admin@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="admin-password">Пароль</Label>
                          <Input
                            id="admin-password"
                            type="password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                        <Button 
                          onClick={addAdmin} 
                          disabled={addingAdmin}
                          className="w-full"
                        >
                          {addingAdmin ? 'Добавление...' : 'Добавить администратора'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>
                  Управление учетными записями с правами администратора
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Загрузка...</p>
                  </div>
                ) : adminUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Нет администраторов</h3>
                    <p className="text-muted-foreground">Добавьте первого администратора</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Имя</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell>{admin.profiles?.email}</TableCell>
                          <TableCell>{admin.profiles?.full_name || 'Не указано'}</TableCell>
                          <TableCell>
                            <Badge variant="default">Администратор</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAdmin(admin.user_id)}
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
        </TabsContent>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Хранилище API-ключей
              </CardTitle>
              <CardDescription>
                Безопасное хранение секретных ключей для внешних сервисов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Key className="w-16 h-16 mx-auto text-muted-foreground mb-6 opacity-50" />
                <h3 className="text-xl font-semibold mb-4">API-ключи управляются через Supabase</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Для безопасности, все API-ключи хранятся в зашифрованном виде в Supabase Edge Functions Secrets.
                </p>
                
                <div className="space-y-4 max-w-sm mx-auto">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-left">
                        <p className="font-medium">RESEND_API_KEY</p>
                        <p className="text-sm text-muted-foreground">Email сервис</p>
                      </div>
                    </div>
                  </Card>
                  
                  <p className="text-sm text-muted-foreground">
                    Для добавления новых ключей используйте Supabase Dashboard
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}