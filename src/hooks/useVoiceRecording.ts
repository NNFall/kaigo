import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250); // Collect data every 250ms
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Ошибка доступа к микрофону",
        description: "Не удалось получить доступ к микрофону. Проверьте разрешения.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);

        try {
          // Stop all tracks to free up the microphone
          const tracks = mediaRecorderRef.current?.stream?.getTracks();
          tracks?.forEach(track => track.stop());

          // Create audio blob
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: 'audio/webm;codecs=opus' 
          });

          if (audioBlob.size === 0) {
            toast({
              title: "Пустая запись",
              description: "Запись не содержит аудиоданных. Попробуйте еще раз.",
              variant: "destructive",
            });
            resolve(null);
            return;
          }

          // Convert to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              
              // Send to transcription service
              const { data, error } = await supabase.functions.invoke('voice-to-text', {
                body: { audio: base64Audio }
              });

              if (error) {
                throw error;
              }

              if (data.text && data.text.trim()) {
                resolve(data.text.trim());
              } else {
                toast({
                  title: "Не удалось распознать речь",
                  description: "Попробуйте говорить четче или проверьте микрофон.",
                  variant: "destructive",
                });
                resolve(null);
              }
            } catch (error) {
              console.error('Error transcribing audio:', error);
              toast({
                title: "Ошибка транскрипции",
                description: "Не удалось обработать аудиозапись. Попробуйте позже.",
                variant: "destructive",
              });
              resolve(null);
            } finally {
              setIsTranscribing(false);
            }
          };

          reader.onerror = () => {
            console.error('Error reading audio file');
            toast({
              title: "Ошибка чтения файла",
              description: "Не удалось прочитать аудиофайл.",
              variant: "destructive",
            });
            setIsTranscribing(false);
            resolve(null);
          };

          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error('Error processing recording:', error);
          setIsTranscribing(false);
          resolve(null);
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, [isRecording, toast]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      const tracks = mediaRecorderRef.current.stream?.getTracks();
      tracks?.forEach(track => track.stop());
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      audioChunksRef.current = [];
    }
  }, [isRecording]);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  };
};