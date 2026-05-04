import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function reviewRepo(repoData: {
  name: string; description: string;
  language: string; stars: number;
  readme: string; commits: string; issues: string;
}) {
  const prompt = `You are a senior software engineer reviewing a GitHub repository.

Repo: ${repoData.name}
Language: ${repoData.language} | Stars: ${repoData.stars}

README: ${repoData.readme}
Recent commits: ${repoData.commits}
Open issues: ${repoData.issues || 'None'}

Respond ONLY with a valid JSON object in this exact format (no markdown code blocks, no backticks, just the JSON string):
{
  "summary": "2-3 sentence overview",
  "score": 78,
  "strengths": ["strength 1", "strength 2"],
  "issues": [{ "severity": "high|medium|low", "title": "...", "detail": "..." }],
  "suggestions": [{ "title": "...", "detail": "..." }],
  "readmeQuality": "good|average|poor",
  "commitQuality": "good|average|poor"
}`;

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash-latest',
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  return JSON.parse(text);
}
