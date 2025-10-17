'use client';

import { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';

export interface DemoEmbedProps {
  src: string;
  title: string;
  height?: string;
  platform?: 'codesandbox' | 'stackblitz' | 'github-pages';
  description?: string;
}

export function DemoEmbed({
  src,
  title,
  height = '600px',
  platform = 'codesandbox',
  description
}: DemoEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  const platformInfo = {
    codesandbox: {
      name: 'CodeSandbox',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 256 296" fill="currentColor">
          <path d="M115.498 261.088v-106.61L23.814 101.73v60.773l41.996 24.347v45.7l49.688 28.54zm23.814.627l50.605-29.151V185.78l42.269-24.495v-60.011l-92.874 53.621v106.82z"/>
          <path d="M128 0l128 73.9v147.8l-128 73.9-128-73.9V73.9L128 0z"/>
        </svg>
      ),
      openUrl: src.replace('/embed/', '/s/')
    },
    stackblitz: {
      name: 'StackBlitz',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 28 28" fill="currentColor">
          <path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z"/>
        </svg>
      ),
      openUrl: src.replace('/embed/', '/')
    },
    'github-pages': {
      name: 'GitHub Pages',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      ),
      openUrl: src
    }
  };

  const info = platformInfo[platform];

  return (
    <div className="my-8 border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {info.icon}
            <span className="font-semibold text-sm">{info.name}</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-sm text-gray-300">{title}</span>
        </div>
        <a
          href={info.openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-300 hover:text-blue-200 flex items-center gap-1 transition-colors"
        >
          <span className="hidden sm:inline">Open in new tab</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Description (if provided) */}
      {description && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-900">{description}</p>
        </div>
      )}

      {/* Demo iframe or loading button */}
      <div className="relative bg-gray-50" style={{ height }}>
        {!loaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="text-center space-y-2">
              <div className="text-gray-400 text-sm">Click to load interactive demo</div>
              <button
                onClick={() => setLoaded(true)}
                className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg
                         hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl
                         flex items-center gap-2 font-medium"
              >
                <Play className="w-5 h-5" />
                Load Interactive Demo
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={src}
            title={title}
            className="w-full h-full border-0"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            loading="lazy"
            allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-write"
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 text-sm text-gray-600 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span>💡 <strong>Tip:</strong> Click &quot;Fork&quot; to create your own copy and experiment!</span>
          {!loaded && (
            <span className="text-xs text-gray-500">Demo loads on demand to save bandwidth</span>
          )}
        </div>
      </div>
    </div>
  );
}
