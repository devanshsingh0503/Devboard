'use client';
import { useState } from 'react';
import { Search, Loader2, Sparkles, GitPullRequest } from 'lucide-react';
import ReviewResult from '@/components/ReviewResult';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prUrl: url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-20 px-4 md:px-8 selection:bg-indigo-500/30">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-indigo-300 mb-4 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Code Reviews</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent pb-2">
            DevBoard
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Paste a GitHub Pull Request URL below and let our AI engine analyze the diff, catch bugs, and summarize the changes instantly.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
          <div className="relative flex flex-col md:flex-row items-center bg-slate-900 border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
            <div className="hidden md:block pl-4 pr-2 text-slate-400">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo/pull/123"
              className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg text-white placeholder-slate-500 w-full"
              required
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="w-full md:w-auto mt-2 md:mt-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Review PR
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
            {error}
          </div>
        )}

        {/* Results Display */}
        {result && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ReviewResult data={result} />
          </div>
        )}
      </div>
    </main>
  );
}
