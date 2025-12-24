import React from "react";

/**
 * MapLoader Component
 * Animated loading overlay for map operations
 * Shows while geocoding, fetching jobs, or calculating clusters
 */
export default function MapLoader({ message = "Finding jobs..." }) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90"
      style={{
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated pulsing circle */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              backgroundColor: "#7c00ff",
              opacity: 0.3,
            }}
          />
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "#7c00ff",
              boxShadow: "0 4px 12px rgba(124, 0, 255, 0.3)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{
                backgroundColor: "#FFFFFF",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Loading text */}
        <p
          className="text-base font-medium"
          style={{
            color: "#1A1A1A",
            fontFamily: "Open Sans",
          }}
        >
          {message}
        </p>

        {/* Dotted path animation */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: "#7c00ff",
                animation: `dotPulse 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }
        @keyframes dotPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

