import React from "react";

export default function GlobeView({ location, searchQuery, hasSearched }) {
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

  // Build the Google Earth URL with the location
  const earthUrl = `https://earth.google.com/web/search/${encodeURIComponent(location)}`;

  return (
    <div className="w-full h-full" style={{ position: 'relative' }}>
      <iframe
        src={earthUrl}
        width="100%"
        height="100%"
        style={{
          border: 'none',
          display: 'block',
        }}
        title="Google Earth View"
        allowFullScreen
      />
    </div>
  );
}

