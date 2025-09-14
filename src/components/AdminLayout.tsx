import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MessageSquare, 
  MessageCircle, 
  Settings, 
  LogOut,
  Shield,
  Menu,
  Home
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  {
    title: 'Дашборд',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Заявки',
    url: '/admin/requests',
    icon: MessageSquare,
  },
  {
    title: 'Диалоги',
    url: '/admin/dialogues',
    icon: MessageCircle,
  },
  {
    title: 'Управление',
    url: '/admin/management',
    icon: Settings,
  },
];

function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Выход выполнен',
        description: 'Вы успешно вышли из системы',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выйти из системы',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sidebar className="admin-sidebar">
      <SidebarContent className="bg-transparent">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-admin-accent-bright font-semibold">
            <Shield className="w-4 h-4" />
            Админ-панель
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`admin-nav-item relative ${location.pathname === item.url ? 'active' : ''}`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    onClick={() => window.location.href = '/'}
                    className="w-full justify-start text-admin-text hover:bg-admin-hover"
                  >
                    <Home className="w-4 h-4" />
                    <span>На сайт</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="admin-logout-btn w-full justify-start"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="admin-layout min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="admin-header h-14 flex items-center px-4">
            <SidebarTrigger className="mr-4 text-admin-text hover:bg-admin-hover" />
            <h1 className="font-semibold text-admin-text">Административная панель</h1>
          </header>
          
          <main className="flex-1 p-6 bg-admin-bg">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}