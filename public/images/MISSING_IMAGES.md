# Missing Images - Action Required

The following images are referenced in the code but don't exist yet. Please add these images to complete your portfolio setup.

## High Priority (Currently Using Fallbacks)

### 1. Avatar Image
**Path:** `/public/images/avatars/avatar.webp`
- **Recommended Size:** 500x500px
- **Format:** WebP (or JPG/PNG to be optimized)
- **Purpose:** Your profile picture on the homepage Hero section
- **Current Fallback:** UI-avatars.com generated placeholder
- **How to Add:**
  ```bash
  # Place your avatar image here, then optimize it:
  npm run optimize:image public/images/avatars/your-avatar.jpg public/images/avatars
  # This will create avatar.webp
  ```

### 2. Default OG Image
**Path:** `/public/images/og/default.png`
- **Required Size:** 1200x630px
- **Format:** PNG or WebP
- **Purpose:** Social media sharing preview (Open Graph)
- **Used When:** Sharing your site on Facebook, Twitter, LinkedIn, etc.
- **How to Create:**
  - Use a design tool (Figma, Canva, etc.)
  - Include your name, title, and branding
  - Keep text readable at small sizes
  - Example text: "Ollie Does Is | Web Developer & Cybersecurity Student"

## Medium Priority (Fallbacks Exist)

### 3. Project Placeholder
**Path:** `/public/images/projects/placeholder.png`
- **Recommended Size:** 1920x1080px
- **Format:** WebP or PNG
- **Purpose:** Fallback for projects without images
- **Suggestion:** Create a branded placeholder with your logo/colors

## Optional (Already Optimized)

✅ **Portfolio Website Project Image**
- Path: `/public/images/projects/full/portfolio-website.webp`
- Status: Created and optimized (24KB)
- Multiple sizes generated

## Quick Commands

```bash
# Optimize a single image
npm run optimize:image path/to/image.jpg output/folder

# Optimize all images in a folder
npm run optimize:batch "path/to/images/*.{jpg,png}"

# Create a 1200x630 OG image from any image
npm run optimize:image your-og-image.png public/images/og
```

## Image Specifications Reference

| Type | Dimensions | Max Size | Format |
|------|------------|----------|--------|
| Avatar | 500x500 | 60KB | WebP |
| OG Image | 1200x630 | 100KB | PNG/WebP |
| Project | 1920x1080 | 150KB | WebP |
| Thumbnail | 400x300 | 50KB | WebP |

## Where to Find Images

**For Avatar:**
- Use a professional headshot
- Or create one with AI tools (DALL-E, Midjourney)
- Or use a branded avatar from services like Gravatar

**For OG Image:**
- Design in Canva (search "Open Graph template")
- Use Figma with 1200x630 artboard
- Generate with tools like OG Image Generator

**For Project Images:**
- Screenshots of your live projects
- Mockups from tools like Screely or Cleanmock
- Design assets from Figma/Sketch

## Next Steps

1. Add your avatar image
2. Create a default OG image for social sharing
3. Create a project placeholder (optional)
4. Run `npm run dev` to see your images in action

For more details, see `/docs/IMAGE_GUIDELINES.md`
