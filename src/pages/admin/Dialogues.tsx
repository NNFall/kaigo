import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Clock, Users } from 'lucide-react';

export default function Dialogues() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Диалоги</h1>
        <p className="text-muted-foreground">Переписки с AI-ассистентом на сайте</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>AI-виджет в разработке</CardTitle>
              <CardDescription>
                Этот раздел будет активен после внедрения AI-ассистента на сайт
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-6 opacity-50" />
            <h3 className="text-xl font-semibold mb-4">Скоро здесь появятся диалоги</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              После внедрения AI-ассистента на сайт, здесь будет отображаться история всех диалогов между посетителями и AI-помощником.
            </p>
            
            <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Пользователи</p>
                    <p className="text-sm text-muted-foreground">Все диалоги</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Сообщения</p>
                    <p className="text-sm text-muted-foreground">История чатов</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Время</p>
                    <p className="text-sm text-muted-foreground">Статистика</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}