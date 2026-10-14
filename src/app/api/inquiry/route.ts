import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const INQUIRY_RECIPIENT = 'tuwinosanda@gmail.com';
const INQUIRY_SENDER = 'Tuwin Website <inquiries@tuwinh.com>';

let resend: Resend | null = null;
function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  let client: Resend;
  try {
    client = getResend();
  } catch (err) {
    console.error('Resend init error:', err);
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  const { error } = await client.emails.send({
    from: INQUIRY_SENDER,
    to: INQUIRY_RECIPIENT,
    replyTo: email,
    subject: `New Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send inquiry.' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
