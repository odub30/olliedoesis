// src/lib/github.ts
import { logError } from '@/lib/logger';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: 'public' | 'private';
}

interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

const EXCLUDED_REPOS = [
  'private-config',
  'sensitive-data',
];

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const getHeaders = () => ({
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'Portfolio-Website',
  ...(GITHUB_TOKEN && { 'Authorization': `Bearer ${GITHUB_TOKEN}` }),
});

export async function getGitHubUser(): Promise<GitHubUser | null> {
  if (!GITHUB_USERNAME) {
    logError('GitHub username not configured in environment variables', new Error('Missing GITHUB_USERNAME'));
    return null;
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    logError('Failed to fetch GitHub user data', error);
    return null;
  }
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  if (!GITHUB_USERNAME) {
    logError('GitHub username not configured in environment variables', new Error('Missing GITHUB_USERNAME'));
    return [];
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers: getHeaders(),
        next: { revalidate: 1800 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    
    return repos.filter(repo => 
      !EXCLUDED_REPOS.includes(repo.name.toLowerCase()) &&
      repo.visibility === 'public'
    );
  } catch (error) {
    logError('Failed to fetch GitHub repositories', error);
    return [];
  }
}