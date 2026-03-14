import { NextResponse } from 'next/server';

import { createLearningItem } from '@/lib/db/store';

export async function POST(request: Request) {
  const formData = await request.formData();
  await createLearningItem({
    profileId: String(formData.get('profileId') ?? 'memory-profile'),
    entrySlug: String(formData.get('entrySlug') ?? 'c-major'),
    visibilityMode: String(formData.get('visibilityMode') ?? 'standard'),
    note: String(formData.get('note') ?? '').trim() || undefined,
  });

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
