import { NextRequest, NextResponse } from 'next/server';
import { getRepoData } from '@/lib/github';
import { reviewRepo } from '@/lib/openai';
import { getCached, setCache } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();
    if (!repoUrl) return NextResponse.json({ error: 'Repo URL required' }, { status: 400 });

    const cacheKey = `repo:${repoUrl}`;
    const cached = await getCached(cacheKey);
    if (cached) return NextResponse.json({ ...JSON.parse(cached as string), cached: true });

    const repoData = await getRepoData(repoUrl);
    const review = await reviewRepo(repoData);
    const result = { ...review, repoUrl, repoName: repoData.name, language: repoData.language, stars: repoData.stars };

    await setCache(cacheKey, result);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
