import { NextResponse } from 'next/server';
import { z } from 'zod';

import { submitReview } from '@/lib/db/store';

const reviewSchema = z.object({
  flashcardId: z.string().min(1),
  rating: z.enum(['again', 'hard', 'good', 'easy']),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = reviewSchema.parse({
    flashcardId: formData.get('flashcardId'),
    rating: formData.get('rating'),
  });

  await submitReview(parsed);
  return NextResponse.redirect(new URL('/review', request.url));
}
