'use client';

import { useState } from 'react';
import { Github, Copy, Star, GitFork, ExternalLink, Check } from 'lucide-react';

export interface GitHubRepoCardProps {
  repoUrl: string;
  description?: string;
  stars?: number;
  forks?: number;
}

export function GitHubRepoCard({
  repoUrl,
  description,
  stars,
  forks
}: GitHubRepoCardProps) {
  const [copied, setCopied] = useState(false);

  // Extract owner and repo from URL
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  const [, owner, repo] = match || [];

  const handleCopyClone = () => {
    const cloneCommand = `git clone ${repoUrl}.git`;
    navigator.clipboard.writeText(cloneCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 border-2 border-gray-200 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-white to-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-white p-3 rounded-lg shadow-lg">
            <Github className="w-8 h-8 text-gray-900" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 text-sm font-medium">Repository</span>
              {stars !== undefined && (
                <>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{stars}</span>
                  </div>
                </>
              )}
              {forks !== undefined && (
                <>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <GitFork className="w-4 h-4" />
                    <span>{forks}</span>
                  </div>
                </>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {owner && repo ? `${owner}/${repo}` : 'Source Code'}
            </h3>
            <p className="text-gray-300 text-sm">
              {description || 'All code examples and demos from this article'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-blue-600 text-2xl">📦</div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">Complete Source Code Available</h4>
              <p className="text-sm text-blue-800">
                Clone this repository to run all examples locally on your machine. Includes README
                with setup instructions and explanations.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3
                       bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md
                       hover:shadow-lg font-medium"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleCopyClone}
              className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3
                       border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium
                       text-gray-700 hover:border-gray-400"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Clone Command</span>
                </>
              )}
            </button>

            <a
              href={`${repoUrl}/stargazers`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-300
                       rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700
                       hover:border-yellow-400 hover:text-yellow-600"
            >
              <Star className="w-5 h-5" />
              <span>Star Repo</span>
            </a>
          </div>

          {/* Quick Start Code */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Quick Start:
            </div>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
              <div className="flex items-start gap-2">
                <span className="text-gray-500 select-none">$</span>
                <code className="flex-1">git clone {repoUrl}.git</code>
              </div>
              <div className="flex items-start gap-2 mt-2">
                <span className="text-gray-500 select-none">$</span>
                <code className="flex-1">cd {repo || 'project'}</code>
              </div>
              <div className="flex items-start gap-2 mt-2">
                <span className="text-gray-500 select-none">$</span>
                <code className="flex-1">npm install && npm run dev</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            <strong>License:</strong> MIT • Free to use and modify
          </span>
          <span className="text-gray-500">
            Found a bug? <a href={`${repoUrl}/issues`} className="text-accent-600 hover:underline" target="_blank" rel="noopener noreferrer">Open an issue</a>
          </span>
        </div>
      </div>
    </div>
  );
}
