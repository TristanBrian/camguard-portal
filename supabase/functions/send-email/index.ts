
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from }: EmailRequest = await req.json();

    // Default sender if not provided
    const fromEmail = from || "KimCom Solutions <noreply@resend.dev>";

    console.log(`Sending email to ${to} with subject '${subject}'`);
    
    // Log the content for development/debugging
    console.log(`Email content: ${html.substring(0, 100)}...`);
    
    // In development, we can extract any links from the email content for testing
    const links = html.match(/href="([^"]*)"[^>]*>/g);
    if (links && links.length) {
      console.log("Links found in email:");
      links.forEach((link, index) => {
        const url = link.match(/href="([^"]*)"/)?.[1];
        if (url) {
          console.log(`Link ${index + 1}: ${url}`);
        }
      });
    }

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    // For development, return links in the response to make them accessible
    // in the frontend during testing
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: emailResponse.id,
        debug: {
          links: links?.map(link => link.match(/href="([^"]*)"/)?.[1]).filter(Boolean) || []
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
