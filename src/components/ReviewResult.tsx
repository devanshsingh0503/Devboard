'use client';

import { CheckCircle2, AlertTriangle, AlertCircle, Lightbulb, GitPullRequest, BookOpen, GitCommit, Star, Code, Sparkles } from 'lucide-react';

interface Issue {
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

interface Suggestion {
  title: string;
  detail: string;
}

export interface ReviewData {
  repoUrl: string;
  repoName: string;
  language: string;
  stars: number;
  summary: string;
  score: number;
  issues: Issue[];
  suggestions: Suggestion[];
  strengths: string[];
  readmeQuality: string;
  commitQuality: string;
  cached?: boolean;
}

export default function ReviewResult({ data }: { data: ReviewData }) {
  // Score color logic
  const scoreColor = 
    data.score >= 80 ? 'text-emerald-400' :
    data.score >= 60 ? 'text-amber-400' : 'text-rose-400';
    
  const scoreBg = 
    data.score >= 80 ? 'bg-emerald-400/10 border-emerald-400/20' :
    data.score >= 60 ? 'bg-amber-400/10 border-amber-400/20' : 'bg-rose-400/10 border-rose-400/20';

  const getSeverityIcon = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'high': return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'low': return <AlertCircle className="w-5 h-5 text-blue-400" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch(quality?.toLowerCase()) {
      case 'good': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'average': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'poor': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 p-6 md:p-8 bg-slate-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><GitPullRequest className="w-4 h-4" /> Repository</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Code className="w-4 h-4" /> {data.language}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400" /> {data.stars} Stars</span>
            {data.cached && (
              <>
                <span>•</span>
                <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full text-xs font-medium border border-indigo-400/20">Cached Result</span>
              </>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            <a href={data.repoUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
              {data.repoName}
            </a>
          </h2>
        </div>
        
        {/* Score Badge */}
        <div className={`shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-2xl border ${scoreBg}`}>
          <span className={`text-4xl font-black ${scoreColor}`}>{data.score}</span>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Score</span>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-10">
        {/* Quality Metrics */}
        <div className="flex flex-wrap gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getQualityColor(data.readmeQuality)}`}>
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">README: <span className="capitalize">{data.readmeQuality || 'Unknown'}</span></span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getQualityColor(data.commitQuality)}`}>
            <GitCommit className="w-5 h-5" />
            <span className="font-medium">Commits: <span className="capitalize">{data.commitQuality || 'Unknown'}</span></span>
          </div>
        </div>

        {/* Summary */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Executive Summary
          </h3>
          <p className="text-slate-300 leading-relaxed text-lg bg-slate-800/30 p-5 rounded-2xl border border-slate-800 shadow-inner">
            {data.summary}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Issues */}
          {data.issues?.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <AlertCircle className="w-5 h-5 text-rose-400" /> Critical Issues
              </h3>
              <div className="space-y-3">
                {data.issues.map((issue, idx) => (
                  <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex gap-3 items-start hover:bg-slate-800/50 transition-colors">
                    <div className="mt-0.5 shrink-0">{getSeverityIcon(issue.severity)}</div>
                    <div>
                      <h4 className="font-medium text-slate-200">{issue.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{issue.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Suggestions */}
          {data.suggestions?.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Lightbulb className="w-5 h-5 text-amber-400" /> Suggestions
              </h3>
              <div className="space-y-3">
                {data.suggestions.map((sug, idx) => (
                  <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex gap-3 items-start hover:bg-slate-800/50 transition-colors">
                    <div className="mt-0.5 shrink-0"><Lightbulb className="w-5 h-5 text-amber-400/70" /></div>
                    <div>
                      <h4 className="font-medium text-slate-200">{sug.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{sug.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Strengths */}
        {data.strengths?.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Key Strengths
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
