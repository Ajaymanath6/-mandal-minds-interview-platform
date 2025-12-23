# CORS Configuration for Google Maps Embedding

This document explains the CORS (Cross-Origin Resource Sharing) configuration implemented to fix map display issues on GitHub Pages.

## Problem
When deployed to GitHub Pages, the Google Maps iframe was not displaying due to CORS and Content Security Policy restrictions.

## Solution Implemented

### 1. Content Security Policy (CSP) Meta Tag
Added in `app/index.html` to allow Google Maps embedding:

```html
<meta http-equiv="Content-Security-Policy" content="frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.googleusercontent.com; ...">
```

**What it does:**
- Allows iframes from Google Maps domains (`frame-src`)
- Permits scripts from Google domains (`script-src`)
- Allows styles from Google Fonts and Google APIs (`style-src`)
- Enables images from any HTTPS source (`img-src`)
- Allows connections to Google APIs (`connect-src`)

### 2. Iframe Configuration
Updated `app/src/components/GlobeView.jsx` with proper iframe attributes:

```jsx
<iframe
  allowFullScreen={true}
  allow="geolocation *; fullscreen *; autoplay *; encrypted-media *; picture-in-picture *"
  referrerPolicy="no-referrer-when-downgrade"
  ...
/>
```

**Key attributes:**
- `allow`: Grants permissions for geolocation, fullscreen, and other features
- `allowFullScreen`: Enables fullscreen mode
- `referrerPolicy`: Controls referrer information sent with requests

### 3. Vite Configuration
Updated `app/vite.config.js` to add CORS headers for development server:

```javascript
server: {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Frame-Options': 'SAMEORIGIN',
  },
}
```

**Note:** These headers only apply to the Vite dev server. GitHub Pages serves static files and doesn't support custom headers, so the CSP meta tag handles production.

## How It Works

1. **Development (localhost):**
   - Vite dev server adds CORS headers automatically
   - CSP meta tag provides additional security

2. **Production (GitHub Pages):**
   - CSP meta tag in HTML controls what resources can be loaded
   - Google Maps iframe is allowed through `frame-src` directive
   - All necessary Google domains are whitelisted

## Testing

After deployment, verify:
1. Map loads correctly on GitHub Pages
2. No console errors related to CORS or CSP
3. Map zoom and location features work properly

## Troubleshooting

If maps still don't load:

1. **Check browser console** for CSP violations
2. **Verify CSP meta tag** is present in the deployed HTML
3. **Check network tab** to see if Google Maps requests are being blocked
4. **Test in incognito mode** to rule out browser extensions

## Additional Notes

- GitHub Pages doesn't support custom HTTP headers (like `.htaccess` or `_headers` files)
- The CSP meta tag is the primary mechanism for controlling resource loading
- Google Maps embed API doesn't require an API key, but proper CSP configuration is essential

## References

- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Google Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

