# Image Guidelines for Olliedoesis Portfolio

This document outlines best practices for managing and optimizing images in the Olliedoesis portfolio project.

## Table of Contents
- [Folder Structure](#folder-structure)
- [Image Formats](#image-formats)
- [Naming Conventions](#naming-conventions)
- [Size Requirements](#size-requirements)
- [Optimization Workflow](#optimization-workflow)
- [Using Next.js Image Component](#using-nextjs-image-component)
- [Tips & Best Practices](#tips--best-practices)

---

## Folder Structure

```
public/
├── images/
│   ├── avatars/           # User profile images (500x500 recommended)
│   ├── projects/          # Project images
│   │   ├── full/         # Full-size optimized images (max 1920px)
│   │   └── thumbnails/   # Thumbnail images (400x300)
│   ├── blog/             # Blog post images
│   ├── og/               # Open Graph images (1200x630)
│   └── uploads/          # User-uploaded media
├── icons/                # App icons and favicons
│   ├── favicon.ico       # Main favicon
│   └── apple-touch-icon.png  # iOS icon (180x180)
└── vectors/              # SVG files
    ├── logos/           # Logo SVGs
    └── icons/           # Icon SVGs
```

### Key Principles:
- **Organized by purpose**: Images grouped by their use case
- **Separate sizes**: Full and thumbnail versions in different folders
- **Vector separation**: Keep SVGs separate from raster images

---

## Image Formats

### Format Selection Guide

| Format | Use Case | Pros | Cons | Recommendation |
|--------|----------|------|------|----------------|
| **WebP** | Photos, screenshots, UI images | 25-35% smaller than JPEG/PNG, transparency support | Limited support in very old browsers | ✅ **Primary format** |
| **AVIF** | Modern web photos | 50% smaller than JPEG | Limited support, slower encoding | Use for cutting-edge projects |
| **JPEG** | Photos (legacy fallback) | Universal support, good compression | No transparency | Use as fallback only |
| **PNG** | Screenshots with text, transparency needs | Lossless, transparency support | Larger file sizes | Use when transparency required |
| **SVG** | Icons, logos, simple graphics | Infinitely scalable, tiny size | Not suitable for photos | ✅ **For all icons/logos** |

### Recommended Priority:
1. **WebP** for all photos and screenshots (primary format)
2. **SVG** for all icons, logos, and simple graphics
3. **PNG** only when transparency + broad support is critical
4. **JPEG** as a fallback for legacy browsers (optional)

---

## Naming Conventions

### Pattern:
```
[category]-[description]-[variant].[format]
```

### Examples:
```
✅ Good:
- project-portfolio-hero.webp
- project-portfolio-thumbnail.webp
- avatar-ollie-500x500.webp
- og-homepage.png
- icon-github.svg
- logo-company-dark.svg

❌ Bad:
- image1.jpg
- IMG_1234.png
- final-version-2-FINAL.jpg
- picture.webp
```

### Rules:
1. **Lowercase only** - No capitals, easier to reference
2. **Kebab-case** - Use hyphens, not underscores or spaces
3. **Descriptive names** - Clear purpose, not generic
4. **Include dimensions** - For multiple sizes (e.g., `avatar-250x250.webp`)
5. **Semantic prefixes** - Use category prefixes (`project-`, `blog-`, `og-`, `icon-`)

---

## Size Requirements

### Target File Sizes:

| Image Type | Dimensions | Target Size | Max Size |
|------------|------------|-------------|----------|
| **Thumbnails** | 400x300 | < 30KB | 50KB |
| **Full Images** | 1920x1080 | < 100KB | 150KB |
| **OG Images** | 1200x630 | < 80KB | 100KB |
| **Avatars** | 500x500 | < 40KB | 60KB |
| **Icons (PNG)** | 180x180 | < 15KB | 20KB |
| **Icons (SVG)** | N/A | < 5KB | 10KB |

### Responsive Image Sizes:

Generate these sizes for responsive images:

```
Full:      1920px width  (desktop)
Medium:    1280px width  (tablet)
Small:     640px width   (mobile)
Thumbnail: 400x300       (grid/card view)
```

### Device Breakpoints (Next.js):
- **640px** - Small mobile
- **750px** - Large mobile
- **828px** - Small tablet
- **1080px** - Tablet/small laptop
- **1200px** - Desktop
- **1920px** - Large desktop

---

## Optimization Workflow

### Automated Optimization

We provide a custom optimization script that:
- Converts images to WebP
- Generates multiple responsive sizes
- Creates thumbnails automatically
- Compresses for optimal file size

#### Using the Optimization Script:

**Single Image:**
```bash
npm run optimize:image public/images/my-image.png
```

**With custom output directory:**
```bash
npm run optimize:image public/images/my-image.png public/images/projects/full
```

**Batch Optimization:**
```bash
npm run optimize:batch "public/images/projects/*.png"
```

#### Script Output:
The script generates:
- `image-name.webp` - Full size (1920px)
- `image-name-md.webp` - Medium (1280px)
- `image-name-sm.webp` - Small (640px)
- `image-name-thumb.webp` - Thumbnail (400x300)

### Manual Optimization

If you prefer manual optimization:

**Tools:**
- [Squoosh](https://squoosh.app/) - Browser-based, excellent for one-off optimizations
- [ImageOptim](https://imageoptim.com/) (Mac) - Drag & drop optimizer
- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimizer

**Settings for WebP:**
- Quality: 80-85% (good balance)
- Effort: 4-6 (medium encoding speed)
- Method: 4 (default)

---

## Using Next.js Image Component

### Basic Usage:

```tsx
import Image from 'next/image'

// Standard usage with WebP
<Image
  src="/images/projects/full/portfolio-website.webp"
  alt="Portfolio Website Screenshot"
  width={1920}
  height={1080}
  priority={false}
/>
```

### With Responsive Sizes:

```tsx
import Image from 'next/image'

// Responsive with srcset
<Image
  src="/images/projects/full/portfolio-website.webp"
  alt="Portfolio Website"
  width={1920}
  height={1080}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### With Blur Placeholder:

```tsx
import Image from 'next/image'

<Image
  src="/images/projects/full/portfolio-website.webp"
  alt="Portfolio Website"
  width={1920}
  height={1080}
  placeholder="blur"
  blurDataURL="data:image/webp;base64,UklGRi..." // Generate with tools
/>
```

### Fill Container (Responsive):

```tsx
import Image from 'next/image'

<div className="relative w-full h-64">
  <Image
    src="/images/projects/full/portfolio-website.webp"
    alt="Portfolio Website"
    fill
    className="object-cover"
  />
</div>
```

### Configuration

Image optimization is configured in `next.config.mjs`:

```javascript
images: {
  formats: ['image/avif', 'image/webp'],  // Prefer AVIF, fallback to WebP
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30,  // 30 days cache
}
```

---

## Tips & Best Practices

### ✅ DO:
1. **Always optimize** images before committing to Git
2. **Use WebP** as the primary format for all photos
3. **Use SVG** for all icons and logos
4. **Use descriptive alt text** for accessibility
5. **Use Next.js Image component** for automatic optimization
6. **Generate multiple sizes** for responsive images
7. **Lazy load** images below the fold
8. **Compress** images to target size requirements
9. **Test** images on mobile devices
10. **Use semantic naming** for better organization

### ❌ DON'T:
1. **Don't commit** unoptimized images (> 200KB)
2. **Don't use** raw camera/screenshot images
3. **Don't use** generic names like `image1.jpg`
4. **Don't use** `<img>` tags - use Next.js `<Image>` instead
5. **Don't forget** alt text (bad for accessibility)
6. **Don't use** JPEG for images with transparency
7. **Don't use** PNG when WebP will work
8. **Don't skip** responsive sizing
9. **Don't use** external image hosts when possible
10. **Don't use** full-size images for thumbnails

### Performance Checklist:
- [ ] Image is WebP or SVG format
- [ ] File size meets target requirements
- [ ] Multiple responsive sizes generated
- [ ] Descriptive filename following conventions
- [ ] Alt text provided for accessibility
- [ ] Using Next.js Image component
- [ ] Lazy loading enabled (priority={false})
- [ ] Image dimensions specified (width/height)

### Accessibility Checklist:
- [ ] Meaningful alt text describing image content
- [ ] Alt text omitted for decorative images (alt="")
- [ ] Text in images is also in HTML
- [ ] Images have sufficient contrast
- [ ] Important images aren't CSS backgrounds

---

## Common Tasks

### Adding a New Project Image:

1. **Prepare the image:**
   ```bash
   # Optimize and generate sizes
   npm run optimize:image public/images/projects/my-project.png public/images/projects/full
   ```

2. **Use in component:**
   ```tsx
   <Image
     src="/images/projects/full/my-project.webp"
     alt="My Project - Description"
     width={1920}
     height={1080}
   />
   ```

### Creating an OG Image:

1. **Dimensions:** 1200x630 pixels
2. **Format:** PNG or WebP
3. **Location:** `/public/images/og/`
4. **Usage in metadata:**
   ```tsx
   export const metadata = {
     openGraph: {
       images: ['/images/og/homepage.png'],
     },
   }
   ```

### Adding an Avatar:

1. **Dimensions:** 500x500 pixels (square)
2. **Optimize:**
   ```bash
   npm run optimize:image public/images/avatars/avatar.jpg public/images/avatars
   ```
3. **Use:**
   ```tsx
   <Image
     src="/images/avatars/avatar.webp"
     alt="Profile picture"
     width={500}
     height={500}
     className="rounded-full"
   />
   ```

---

## Troubleshooting

### Image Not Loading:
- Check file path is correct (case-sensitive)
- Verify file exists in `/public` directory
- Check Next.js dev server is running
- Clear `.next` cache: `npm run clean && npm run dev`

### Image Quality Issues:
- Increase quality setting in optimization script (85-90)
- Check source image quality before optimization
- Use PNG for images with text
- Consider using original size for small images

### Large Bundle Size:
- Run `npm run optimize:batch` on all images
- Check for duplicate images in different locations
- Use WebP instead of PNG where possible
- Remove unused images from `/public`

---

## Resources

### Tools:
- [Squoosh](https://squoosh.app/) - Web-based image optimizer
- [ImageOptim](https://imageoptim.com/) - Mac image optimizer
- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimizer

### Documentation:
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [WebP Format](https://developers.google.com/speed/webp)
- [Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

### Testing:
- [WebPageTest](https://www.webpagetest.org/) - Performance testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome DevTools audit
- [PageSpeed Insights](https://pagespeed.web.dev/) - Google's performance tool

---

## Questions?

If you have questions about image optimization or need help:
1. Check this guide first
2. Review the optimization script: `scripts/optimize-images.js`
3. Test with the optimization tool: `npm run optimize:image --help`
4. Consult Next.js Image documentation

---

**Last Updated:** October 2025
**Maintained by:** Ollie Does Is
