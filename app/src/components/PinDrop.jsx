import React from "react";
import { LocationCompanyFilled } from "@carbon/icons-react";

/**
 * Custom PinDrop Component
 * White box with company logo inside
 * Features bouncy animation when appearing
 */
export default function PinDrop({ 
  logoUrl = null, // URL to company logo image
  size = 50, 
  className = "",
  animated = false // Enable bouncy animation
}) {
  const boxSize = size; // White box size
  
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
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Company logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

/**
 * Function to create Leaflet icon from PinDrop component
 * Creates a white box with company logo inside
 * Returns a data URL for Leaflet marker
 */
export const createPinDropIcon = (logoUrl = null, size = 50) => {
  const boxSize = size;
  const borderRadius = 8;
  
  // Create SVG string with white box and logo (no fallback icon)
  let logoContent = '';
  if (logoUrl) {
    // Use company logo image - fills entire box
    logoContent = `<image href="${logoUrl}" x="0" y="0" width="${boxSize}" height="${boxSize}" preserveAspectRatio="xMidYMid slice" />`;
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
