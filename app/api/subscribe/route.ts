import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // If Supabase is not configured, just return success
    if (!supabase) {
      console.log('Supabase not configured, email not stored:', email);
      return NextResponse.json({ success: true, stored: false });
    }

    // Insert into Supabase (upsert to handle duplicates)
    const { error } = await supabase
      .from('email_subscribers')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          source: 'claude-code-training',
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Don't fail the user experience if Supabase fails
      // Just log and continue
      return NextResponse.json({ success: true, stored: false });
    }

    return NextResponse.json({ success: true, stored: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    // Don't fail the user experience
    return NextResponse.json({ success: true, stored: false });
  }
}
