// Newsletter subscription API

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    // Insert subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ 
        email: email.toLowerCase().trim(),
      }]);

    if (error) {
      // Check if already subscribed
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 200 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Subscription failed. Please try again.' },
      { status: 500 }
    );
  }
}
