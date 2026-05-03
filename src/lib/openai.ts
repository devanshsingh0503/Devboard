import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function reviewPR(prData: {
  title: string;
  description: string;
  diff: string;
}) {
  const prompt = `You are a senior software engineer doing a code review.

PR Title: ${prData.title}
PR Description: ${prData.description}

Code Diff:
${prData.diff}

Respond ONLY with JSON in this exact format:
{
  "summary": "2-3 sentence overview",
  "score": 85,
  "issues": [
    { "severity": "high|medium|low", "title": "...", "detail": "..." }
  ],
  "suggestions": [
    { "title": "...", "detail": "..." }
  ],
  "positives": ["What was done well"]
}`;

  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(res.choices[0].message.content || '{}');
}
