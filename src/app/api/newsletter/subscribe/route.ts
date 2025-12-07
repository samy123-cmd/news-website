import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';

const subscribeSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: Request) {
    // Rate limiting check - stricter for newsletter to prevent email bombing
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, 'newsletter', RATE_LIMITS.NEWSLETTER);

    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Too many subscription attempts. Please try again later.' },
            {
                status: 429,
                headers: rateLimitHeaders(rateLimitResult)
            }
        );
    }

    try {
        const body = await request.json();

        // Validate input
        const { email } = subscribeSchema.parse(body);

        const supabase = await createClient();

        // Check if already subscribed
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id, status')
            .eq('email', email)
            .single();

        if (existing) {
            if (existing.status === 'unsubscribed') {
                // Reactivate subscription
                const { error: updateError } = await supabase
                    .from('newsletter_subscribers')
                    .update({ status: 'active' })
                    .eq('id', existing.id);

                if (updateError) throw updateError;

                return NextResponse.json({ message: "Welcome back! You've been resubscribed." });
            }
            return NextResponse.json(
                { message: "You are already subscribed!" },
                { status: 200 } // Treat as success to avoid leaking info/confusing user
            );
        }

        // Create new subscription
        const { error: insertError } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email, status: 'active' }]);

        if (insertError) {
            // Handle unique constraint violation just in case race condition
            if ((insertError as any).code === '23505') {
                return NextResponse.json(
                    { message: "You are already subscribed!" },
                    { status: 200 }
                );
            }
            throw insertError;
        }

        return NextResponse.json({ message: "Successfully subscribed! Check your inbox soon." });

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again later." },
            { status: 500 }
        );
    }
}
