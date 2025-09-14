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

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 1000); // Limit length and trim whitespace
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    
    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ 
        error: 'Слишком много запросов. Попробуйте позже.',
        success: false 
      }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const requestBody = await req.json();
    const { name, contact, message }: ContactRequest = requestBody;

    // Validate and sanitize input
    if (!name || !contact) {
      return new Response(JSON.stringify({ 
        error: 'Имя и контакт обязательны для заполнения',
        success: false 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const sanitizedData = {
      name: sanitizeInput(name),
      contact: sanitizeInput(contact),
      message: message ? sanitizeInput(message) : null
    };

    console.log('Received contact request from IP:', clientIP, { 
      name: sanitizedData.name, 
      contact: sanitizedData.contact.slice(0, 10) + '...', // Log partial contact for privacy
      hasMessage: !!sanitizedData.message 
    });

    // Save to database
    const { data, error: dbError } = await supabase
      .from('contact_requests')
      .insert([sanitizedData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('Saved to database:', data);

    // Send email notification - use environment variable for recipient
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'nikitanovyj1@gmail.com';
    const emailResponse = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `Новая заявка от ${sanitizedData.name}`,
      html: `
        <h2>Новая заявка с сайта-портфолио</h2>
        <p><strong>Имя:</strong> ${sanitizedData.name}</p>
        <p><strong>Контакт:</strong> ${sanitizedData.contact}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${sanitizedData.message || 'Сообщение не указано'}</p>
        <hr>
        <p><small>Время: ${new Date().toLocaleString('ru-RU')}</small></p>
        <p><small>IP: ${clientIP}</small></p>
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