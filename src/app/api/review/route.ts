import { NextRequest, NextResponse } from 'next/server';
import { getPRData } from '@/lib/github';
import { reviewPR } from '@/lib/openai';
import { getCached, setCache } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const { prUrl } = await req.json();
    if (!prUrl) return NextResponse.json({ error: 'PR URL required' }, { status: 400 });

    const cacheKey = `review:${prUrl}`;
    const cached = await getCached(cacheKey);
    if (cached) {
      return NextResponse.json({ ...JSON.parse(cached as string), cached: true });
    }

    const prData = await getPRData(prUrl);
    const review = await reviewPR(prData);
    const result = { ...review, prUrl, prTitle: prData.title, author: prData.author };
    await setCache(cacheKey, result);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
