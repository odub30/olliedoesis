/**
 * Canonical URL Utility
 * Generates canonical URLs for SEO purposes.
 * All URLs use the non-www version: https://olliedoesis.dev
 */

const SITE_URL = 'https://olliedoesis.dev'

export function getCanonicalUrl(path: string): string {
  if (!path || path === '/') {
    return SITE_URL
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const finalPath = cleanPath.endsWith('/') && cleanPath.length > 1
    ? cleanPath.slice(0, -1)
    : cleanPath

  return `${SITE_URL}/${finalPath}`
}

export function getSiteUrl(): string {
  return SITE_URL
}

export function getCanonicalUrlWithParams(
  path: string,
  searchParams?: URLSearchParams | Record<string, string>
): string {
  const baseUrl = getCanonicalUrl(path)

  if (!searchParams) {
    return baseUrl
  }

  const params = searchParams instanceof URLSearchParams
    ? searchParams
    : new URLSearchParams(searchParams)

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
