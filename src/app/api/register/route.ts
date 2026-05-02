import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/utils/mailer';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await sendWelcomeEmail(email, name || email.split('@')[0]);

    return NextResponse.json({ success: true, message: 'Welcome email sent!' });
  } catch (error) {
    console.error('Mailer error:', error);
    // Don't fail the registration if email fails — just log it
    return NextResponse.json({ success: false, message: 'Email could not be sent' }, { status: 500 });
  }
}
