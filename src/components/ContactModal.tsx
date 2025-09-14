import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    interested_project: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interested_project: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        throw error;
      }

      console.log('Contact form submitted successfully:', data);
      setIsSubmitted(true);
      
      toast({
        title: "Заявка отправлена!",
        description: "Спасибо за обращение. Я свяжусь с вами в ближайшее время.",
      });

      // Reset and close after 2 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', contact: '', interested_project: '', message: '' });
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Ошибка отправки",
        description: "Произошла ошибка при отправке заявки. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-sm border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold gradient-text">
            Связаться со мной
          </DialogTitle>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Спасибо за обращение!</h3>
            <p className="text-muted-foreground">Я свяжусь с вами в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ваше имя"
                required
                className="bg-background/50 border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Телефон или Telegram *</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+7 (999) 123-45-67 или @username"
                required
                className="bg-background/50 border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interested_project">Какой проект вас заинтересовал? *</Label>
              <Select value={formData.interested_project} onValueChange={handleSelectChange} required>
                <SelectTrigger className="bg-background/50 border-white/20">
                  <SelectValue placeholder="Выберите проект" />
                </SelectTrigger>
                <SelectContent className="bg-background border-white/20 z-50">
                  <SelectItem value="ai-voice-assistant">AI Голосовой ассистент для колл-центра</SelectItem>
                  <SelectItem value="ai-chatbot">Интеллектуальный чат-бот для e-commerce</SelectItem>
                  <SelectItem value="vr-trainer">VR-тренажер с AI для нейрохирургов</SelectItem>
                  <SelectItem value="other">Другой вопрос</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Сообщение</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Расскажите о вашем проекте..."
                rows={4}
                className="bg-background/50 border-white/20 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-hero"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Отправляю...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Отправить сообщение
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};