export function parseRepoUrl(url: string) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error('Invalid GitHub repo URL');
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

interface GitHubCommit {
  commit: {
    message: string;
  };
}

interface GitHubIssue {
  title: string;
}

export async function getRepoData(url: string) {
  const { owner, repo } = parseRepoUrl(url);
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const [repoRes, commitsRes, issuesRes, readmeRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=5`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { ...headers, Accept: 'application/vnd.github.v3.raw' },
    }),
  ]);

  if (!repoRes.ok) throw new Error('Repo not found or is private');

  const repoData = await repoRes.json() as GitHubRepo;
  const commits = commitsRes.ok ? await commitsRes.json() as GitHubCommit[] : [];
  const issues = issuesRes.ok ? await issuesRes.json() as GitHubIssue[] : [];
  const readme = readmeRes.ok ? await readmeRes.text() : 'No README found';

  return {
    name: repoData.name,
    description: repoData.description || 'No description',
    language: repoData.language || 'Unknown',
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    readme: readme.slice(0, 3000),
    commits: commits.map((c) => c.commit.message).join('\n'),
    issues: issues.map((i) => i.title).join('\n'),
  };
}
