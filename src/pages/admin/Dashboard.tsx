import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Eye, Users, TrendingUp, Clock, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface Stats {
  totalRequests: number;
  todayRequests: number;
  weekRequests: number;
  pendingRequests: number;
  completedRequests: number;
}

interface ChartData {
  name: string;
  requests: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function Dashboard() {
  const { userRole } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalRequests: 0,
    todayRequests: 0,
    weekRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
  });
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [projectData, setProjectData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchDashboardData();
    }
  }, [userRole]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all contact requests
      const { data: contacts, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Calculate stats
      const totalRequests = contacts?.length || 0;
      const todayRequests = contacts?.filter(c => 
        new Date(c.created_at) >= today
      ).length || 0;
      const weekRequests = contacts?.filter(c => 
        new Date(c.created_at) >= weekAgo
      ).length || 0;
      const pendingRequests = contacts?.filter(c => 
        c.status === 'new' || c.status === 'in_progress'
      ).length || 0;
      const completedRequests = contacts?.filter(c => 
        c.status === 'completed'
      ).length || 0;

      setStats({
        totalRequests,
        todayRequests,
        weekRequests,
        pendingRequests,
        completedRequests,
      });

      // Generate weekly chart data
      const weeklyChartData: ChartData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toLocaleDateString('ru-RU', { weekday: 'short' });
        const requestsCount = contacts?.filter(c => {
          const createdDate = new Date(c.created_at);
          return (
            createdDate.toDateString() === date.toDateString()
          );
        }).length || 0;
        
        weeklyChartData.push({
          name: dateStr,
          requests: requestsCount,
        });
      }
      setWeeklyData(weeklyChartData);

      // Generate project interest data
      const projectCounts: { [key: string]: number } = {};
      contacts?.forEach(c => {
        if (c.interested_project) {
          const projectName = getProjectDisplayName(c.interested_project);
          projectCounts[projectName] = (projectCounts[projectName] || 0) + 1;
        }
      });

      const projectChartData = Object.entries(projectCounts).map(([name, value]) => ({
        name,
        value,
      }));
      setProjectData(projectChartData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectDisplayName = (projectKey: string) => {
    const projectMap: { [key: string]: string } = {
      'ai-voice-assistant': 'AI Голосовой ассистент',
      'ai-chatbot': 'AI чат-бот',
      'vr-trainer': 'VR-тренажер',
      'other': 'Другие вопросы',
    };
    return projectMap[projectKey] || projectKey;
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
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-admin-text">Дашборд</h1>
        <p className="text-admin-text-muted">Обзор ключевых метрик и статистики</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">Всего заявок</CardTitle>
            <MessageSquare className="h-4 w-4 text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">{stats.totalRequests}</div>
            <p className="text-xs text-admin-text-muted">
              За всё время
            </p>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">За сегодня</CardTitle>
            <Calendar className="h-4 w-4 text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">{stats.todayRequests}</div>
            <p className="text-xs text-admin-text-muted">
              Новые заявки сегодня
            </p>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">За неделю</CardTitle>
            <TrendingUp className="h-4 w-4 text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">{stats.weekRequests}</div>
            <p className="text-xs text-admin-text-muted">
              Последние 7 дней
            </p>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">В работе</CardTitle>
            <Clock className="h-4 w-4 text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">{stats.pendingRequests}</div>
            <p className="text-xs text-admin-text-muted">
              Требуют внимания
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-admin-text">Заявки по дням</CardTitle>
            <CardDescription className="text-admin-text-muted">
              Количество заявок за последние 7 дней
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--admin-border))" />
                <XAxis dataKey="name" stroke="hsl(var(--admin-text-muted))" />
                <YAxis stroke="hsl(var(--admin-text-muted))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--admin-sidebar))', 
                    border: '1px solid hsl(var(--admin-border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--admin-text))'
                  }} 
                />
                <Bar dataKey="requests" fill="hsl(var(--admin-accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-admin-text">Интерес к проектам</CardTitle>
            <CardDescription className="text-admin-text-muted">
              Распределение заявок по проектам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--admin-sidebar))', 
                    border: '1px solid hsl(var(--admin-border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--admin-text))'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="text-admin-text">Статистика обработки</CardTitle>
          <CardDescription className="text-admin-text-muted">
            Текущий статус всех заявок
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-admin-accent/20 text-admin-accent border-admin-accent/30">{stats.pendingRequests}</Badge>
              <span className="text-sm text-admin-text-muted">Ожидают обработки</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-admin-accent text-white">{stats.completedRequests}</Badge>
              <span className="text-sm text-admin-text-muted">Завершено</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}