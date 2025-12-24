import React from "react";
import { LocationCompanyFilled } from "@carbon/icons-react";

/**
 * Custom PinDrop Component
 * White box with company logo inside
 * Features bouncy animation when appearing
 */
export default function PinDrop({ 
  logoUrl = null, // URL to company logo image
  iconColor = "#7c00ff", // Fallback icon color if no logo
  size = 50, 
  className = "",
  animated = false // Enable bouncy animation
}) {
  const boxSize = size; // White box size
  const logoSize = size * 0.7; // Logo size inside box (70% of box)
  const padding = size * 0.15; // Padding around logo (15% of box)
  
  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: animated ? 'pinBounce 0.6s ease-out' : 'none',
      }}
    >
      <style>{`
        @keyframes pinBounce {
          0% { 
            transform: scale(0) translateY(0);
            opacity: 0;
          }
          50% { 
            transform: scale(1.15) translateY(-8px);
            opacity: 0.9;
          }
          70% {
            transform: scale(0.95) translateY(2px);
          }
          100% { 
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      
      {/* White Box with Company Logo */}
      <div
        style={{
          width: boxSize,
          height: boxSize,
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: padding,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Company logo"
            style={{
              width: logoSize,
              height: logoSize,
              objectFit: 'contain',
            }}
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        {!logoUrl && (
          <LocationCompanyFilled 
            size={logoSize} 
            style={{ 
              fill: iconColor,
              color: iconColor,
              display: logoUrl ? 'none' : 'block',
            }} 
          />
        )}
      </div>
    </div>
  );
}

/**
 * Function to create Leaflet icon from PinDrop component
 * Creates a white box with company logo inside
 * Returns a data URL for Leaflet marker
 */
export const createPinDropIcon = (logoUrl = null, iconColor = "#7c00ff", size = 50) => {
  const boxSize = size;
  const logoSize = size * 0.7;
  const padding = size * 0.15;
  const borderRadius = 8;
  
  // LocationCompanyFilled icon SVG path (fallback if no logo)
  const scale = logoSize / 32; // Carbon icons are 32x32 by default
  const centerX = size / 2;
  const iconCenterX = 16;
  const mainPath = "M16,2A11.0134,11.0134,0,0,0,5,13a10.8885,10.8885,0,0,0,2.2163,6.6s.3.3945.3482.4517L16,30l8.439-9.9526c.0444-.0533.3447-.4478.3447-.4478l.0015-.0024A10.8846,10.8846,0,0,0,27,13,11.0134,11.0134,0,0,0,16,2Zm1,16H15V16h2Zm0-4H15V12h2Zm4,4H19V10H13v8H11V10a2.0023,2.0023,0,0,1,2-2h6a2.0023,2.0023,0,0,1,2,2Z";
  
  // Create SVG string with white box and logo/icon
  let logoContent = '';
  if (logoUrl) {
    // Use company logo image
    logoContent = `<image href="${logoUrl}" x="${padding}" y="${padding}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />`;
  } else {
    // Use fallback icon
    logoContent = `<g transform="translate(${centerX - iconCenterX * scale}, ${(size - logoSize) / 2}) scale(${scale})">
      <path d="${mainPath}" fill="${iconColor}" />
    </g>`;
  }
  
  const svgString = `
    <svg width="${boxSize}" height="${boxSize}" viewBox="0 0 ${boxSize} ${boxSize}" xmlns="http://www.w3.org/2000/svg">
      <!-- White box background -->
      <rect 
        x="0" 
        y="0" 
        width="${boxSize}" 
        height="${boxSize}" 
        rx="${borderRadius}" 
        ry="${borderRadius}"
        fill="#FFFFFF"
        stroke="rgba(0, 0, 0, 0.05)"
        stroke-width="1"
      />
      <!-- Drop shadow filter -->
      <defs>
        <filter id="boxShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge> 
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      <rect 
        x="0" 
        y="0" 
        width="${boxSize}" 
        height="${boxSize}" 
        rx="${borderRadius}" 
        ry="${borderRadius}"
        fill="#FFFFFF"
        filter="url(#boxShadow)"
      />
      <!-- Company logo or icon -->
      ${logoContent}
    </svg>
  `;
  
  // Convert SVG to data URL
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  return svgUrl;
};
