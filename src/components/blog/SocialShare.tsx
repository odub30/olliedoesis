'use client';

import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

export interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

export function SocialShare({ title, url, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer,width=600,height=600');
    setShowShareMenu(false);
  };

  // Check if Web Share API is available
  const canUseWebShare = typeof navigator !== 'undefined' && navigator.share;

  const handleNativeShare = async () => {
    if (canUseWebShare) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        });
      } catch (err) {
        // User cancelled or share failed
        console.error('Share failed:', err);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Main share button */}
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600
                   text-white rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all shadow-md
                   hover:shadow-lg font-medium text-sm"
          aria-label="Share this article"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Article</span>
        </button>

        {/* Copy link button */}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg
                   hover:bg-gray-50 transition-all font-medium text-sm text-gray-700 hover:border-gray-400"
          aria-label="Copy link to clipboard"
        >
          <LinkIcon className="w-4 h-4" />
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>

        {/* Direct share buttons (always visible on desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-400
                     transition-colors group"
            aria-label="Share on Twitter"
            title="Share on Twitter"
          >
            <Twitter className="w-4 h-4 text-gray-600 group-hover:text-blue-500" />
          </button>

          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-600
                     transition-colors group"
            aria-label="Share on LinkedIn"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
          </button>

          <button
            onClick={() => handleShare('facebook')}
            className="p-2 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-700
                     transition-colors group"
            aria-label="Share on Facebook"
            title="Share on Facebook"
          >
            <Facebook className="w-4 h-4 text-gray-600 group-hover:text-blue-700" />
          </button>
        </div>
      </div>

      {/* Dropdown share menu (shown when Web Share API is not available on mobile) */}
      {showShareMenu && !canUseWebShare && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200
                      py-2 min-w-[200px] z-50 md:hidden">
          <button
            onClick={() => handleShare('twitter')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
          >
            <Twitter className="w-4 h-4 text-blue-500" />
            <span>Share on Twitter</span>
          </button>

          <button
            onClick={() => handleShare('linkedin')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
          >
            <Linkedin className="w-4 h-4 text-blue-600" />
            <span>Share on LinkedIn</span>
          </button>

          <button
            onClick={() => handleShare('facebook')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
          >
            <Facebook className="w-4 h-4 text-blue-700" />
            <span>Share on Facebook</span>
          </button>

          <button
            onClick={() => handleShare('reddit')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
          >
            <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
            <span>Share on Reddit</span>
          </button>
        </div>
      )}
    </div>
  );
}
