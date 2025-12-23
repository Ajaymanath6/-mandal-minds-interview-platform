import React from "react";

export default function GlobeView({ location, searchQuery, hasSearched, zoom = 10 }) {
  // If no location is found and user has searched, show a message
  if (!location && hasSearched) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <p className="text-base font-medium text-[#1A1A1A] mb-2" style={{ fontFamily: 'Open Sans' }}>
            Please include a location in your search
          </p>
          <p className="text-sm text-[#575757]" style={{ fontFamily: 'Open Sans' }}>
            Example: "Designer in London" or "Frontend developer in New York"
          </p>
        </div>
      </div>
    );
  }

  // If no location and hasn't searched yet, show empty state
  if (!location && !hasSearched) {
    return (
      <div className="w-full h-full bg-white">
        {/* Empty state - no message until search is clicked */}
      </div>
    );
  }

  // Use Google Maps embed iframe - NO API KEY REQUIRED
  // Default roadmap view with zoom parameter
  // Note: "Directions" and "View larger map" links are part of Google's embed
  // and cannot be removed due to cross-origin restrictions (they're inside the iframe)
  // Zoom levels: 1 (world) to 20 (buildings), default is 10
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=${zoom}&output=embed`;

  return (
    <div className="w-full h-full" style={{ position: 'relative', backgroundColor: 'white', overflow: 'hidden', margin: 0, padding: 0 }}>
      <iframe
        src={mapsUrl}
        width="100%"
        height="100%"
        style={{
          border: 'none',
          display: 'block',
          margin: 0,
          padding: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        title="Google Maps View"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        frameBorder="0"
      />
    </div>
  );
}

