import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Bot, Key, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AISettings {
  id: string;
  api_key: string;
  model: string;
  system_prompt: string;
  widget_enabled: boolean;
  max_tokens: number;
  temperature: number;
}

const AISettings = () => {
  const { user, userRole } = useAuth();
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const availableModels = [
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Быстрая)' },
    { value: 'openai/gpt-4o', label: 'GPT-4o (Мощная)' },
    { value: 'anthropic/claude-3-haiku', label: 'Claude 3 Haiku (Быстрая)' },
    { value: 'anthropic/claude-3-sonnet', label: 'Claude 3 Sonnet (Сбалансированная)' },
    { value: 'anthropic/claude-3-opus', label: 'Claude 3 Opus (Самая мощная)' },
  ];

  useEffect(() => {
    if (userRole === 'admin') {
      fetchSettings();
    }
  }, [userRole]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const defaultSettings = {
          api_key: '',
          model: 'openai/gpt-4o-mini',
          system_prompt: 'Вы полезный AI-ассистент, готовый помочь пользователям с их вопросами. Отвечайте вежливо и информативно на русском языке.',
          widget_enabled: true,
          max_tokens: 3000,
          temperature: 0.7
        };
        setSettings(defaultSettings as AISettings);
      }
    } catch (error) {
      console.error('Error fetching AI settings:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки AI",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      if (settings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('ai_settings')
          .update({
            api_key: settings.api_key,
            model: settings.model,
            system_prompt: settings.system_prompt,
            widget_enabled: settings.widget_enabled,
            max_tokens: settings.max_tokens,
            temperature: settings.temperature
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('ai_settings')
          .insert({
            api_key: settings.api_key,
            model: settings.model,
            system_prompt: settings.system_prompt,
            widget_enabled: settings.widget_enabled,
            max_tokens: settings.max_tokens,
            temperature: settings.temperature
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSettings({ ...settings, id: data.id });
        }
      }

      toast({
        title: "Успешно",
        description: "Настройки AI сохранены",
      });
    } catch (error) {
      console.error('Error saving AI settings:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Настройки AI</h1>
          <p className="text-muted-foreground">Управление AI-ассистентом</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Настройки AI</h1>
        <p className="text-muted-foreground">Управление AI-ассистентом и его поведением</p>
      </div>

      <div className="grid gap-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Конфигурация
            </CardTitle>
            <CardDescription>
              Настройки подключения к VseGPT API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api_key">API Ключ VseGPT</Label>
              <Input
                id="api_key"
                type="password"
                value={settings?.api_key || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, api_key: e.target.value } : null)}
                placeholder="sk-xxxxxxxxxxxxxxxx"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Модель</Label>
              <Select
                value={settings?.model || ''}
                onValueChange={(value) => setSettings(prev => prev ? { ...prev, model: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите модель" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* AI Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Поведение AI
            </CardTitle>
            <CardDescription>
              Настройка личности и стиля ответов AI-ассистента
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system_prompt">Системный промпт</Label>
              <Textarea
                id="system_prompt"
                value={settings?.system_prompt || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, system_prompt: e.target.value } : null)}
                placeholder="Опишите как должен вести себя AI-ассистент..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_tokens">Максимум токенов</Label>
                <Input
                  id="max_tokens"
                  type="number"
                  min="100"
                  max="8000"
                  value={settings?.max_tokens || 3000}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, max_tokens: parseInt(e.target.value) } : null)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Температура (0-1)</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings?.temperature || 0.7}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, temperature: parseFloat(e.target.value) } : null)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Widget Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Настройки виджета
            </CardTitle>
            <CardDescription>
              Управление отображением AI-виджета на сайте
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="widget_enabled"
                checked={settings?.widget_enabled || false}
                onCheckedChange={(checked) => setSettings(prev => prev ? { ...prev, widget_enabled: checked } : null)}
              />
              <Label htmlFor="widget_enabled">Включить AI-виджет на сайте</Label>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={saving || !settings?.api_key}
            className="min-w-32"
          >
            {saving ? (
              <>
                <Settings className="h-4 w-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AISettings;