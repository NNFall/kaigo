import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  name: string;
  contact: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { name, contact, message }: ContactRequest = await req.json();

    console.log('Received contact request:', { name, contact, message });

    // Save to database
    const { data, error: dbError } = await supabase
      .from('contact_requests')
      .insert([{ name, contact, message }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('Saved to database:', data);

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["novoseltsevnikitos@yandex.ru"],
      subject: `Новая заявка от ${name}`,
      html: `
        <h2>Новая заявка с сайта-портфолио</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Контакт:</strong> ${contact}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${message || 'Сообщение не указано'}</p>
        <hr>
        <p><small>Время: ${new Date().toLocaleString('ru-RU')}</small></p>
      `,
    });

    if (emailResponse.error) {
      console.error('Email error:', emailResponse.error);
      throw new Error(`Email error: ${emailResponse.error.message}`);
    }

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      id: data.id,
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);