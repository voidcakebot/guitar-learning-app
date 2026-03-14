import { NextResponse } from 'next/server';

import { createLearningItem } from '@/lib/db/store';

export async function POST(request: Request) {
  const formData = await request.formData();
  const focusAreas = formData.getAll('focusAreas').map((value) => String(value).trim()).filter(Boolean).join(',');

  await createLearningItem({
    profileId: String(formData.get('profileId') ?? 'memory-profile'),
    entrySlug: String(formData.get('entrySlug') ?? 'c-major'),
    visibilityMode: String(formData.get('visibilityMode') ?? 'guided'),
    focusAreas: focusAreas || undefined,
    note: String(formData.get('note') ?? '').trim() || undefined,
  });

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
