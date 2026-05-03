export function parsePRUrl(url: string) {
  const match = url.match(
    /github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/
  );
  if (!match) throw new Error('Invalid GitHub PR URL');
  return { owner: match[1], repo: match[2], pull_number: parseInt(match[3]) };
}

export async function getPRData(url: string) {
  const { owner, repo, pull_number } = parsePRUrl(url);
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const [prRes, diffRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`, {
      headers: { ...headers, Accept: 'application/vnd.github.v3.diff' },
    }),
  ]);

  if (!prRes.ok) throw new Error('PR not found or private repo');
  const pr = await prRes.json();
  const diff = await diffRes.text();

  return {
    title: pr.title,
    description: pr.body || '',
    author: pr.user.login,
    diff: diff.slice(0, 8000),
  };
}
