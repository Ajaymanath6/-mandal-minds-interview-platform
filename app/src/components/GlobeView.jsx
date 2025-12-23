import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Helper function to convert pincode to coordinates
const getCoordinatesFromPincode = async (pincode, districtName, stateName) => {
  // Try geocoding with full address first
  const address = `${pincode}, ${districtName}, ${stateName}, India`;
  const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  
  try {
    const response = await fetch(geocodeUrl, {
      headers: {
        "User-Agent": "MandalMinds/1.0",
      },
    });
    
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
};

export default function GlobeView({ location, searchQuery, hasSearched, zoom = 10, journeyStep = null }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const previousLocationRef = useRef(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!location || !hasSearched) return;

    // Initialize map if not already created
    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
        zoomAnimation: true, // Enable zoom animations
        zoomAnimationThreshold: 4, // Animate zoom if difference is >= 4
      }).setView([0, 0], zoom);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Geocode location to get coordinates
    if (mapInstanceRef.current && location) {
      // Check if location is a pincode (6-digit number)
      const isPincode = /^\d{6}$/.test(location.trim());
      
      let geocodeUrl;
      if (isPincode) {
        // If it's a pincode, try to get coordinates directly
        geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${location.trim()}&country=India&limit=1`;
      } else {
        // Use Nominatim (OpenStreetMap's geocoding service) - FREE, no API key
        geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;
      }
      
      fetch(geocodeUrl, {
        headers: {
          "User-Agent": "MandalMinds/1.0", // Required by Nominatim
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            
            // Check if this is a state-level view (step 1) or specific location (step 2)
            const isStateView = journeyStep === 1;
            const isLocationView = journeyStep === 2;
            
            // Use flyTo for smooth, camera-like animation (much better than setView)
            // This creates a beautiful "flying" effect to the location
            if (isStateView) {
              // Step 1: First show state - medium zoom, smooth flyTo animation
              mapInstanceRef.current.flyTo([lat, lon], zoom, {
                duration: 1.5,
                easeLinearity: 0.25,
              });
            } else if (isLocationView) {
              // Step 2: Zoom in from state to location - dramatic flyTo animation with zoom
              // This creates a smooth zoom-in effect
              mapInstanceRef.current.flyTo([lat, lon], zoom, {
                duration: 2.5,
                easeLinearity: 0.25,
              });
            } else {
              // Default smooth flyTo animation for direct location searches
              mapInstanceRef.current.flyTo([lat, lon], zoom, {
                duration: 1.5,
                easeLinearity: 0.25,
              });
            }

            // Remove existing marker if any (only show marker for specific locations, not states)
            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current);
              markerRef.current = null;
            }

            // Only add marker for specific locations (not for state views)
            // Show marker only when we're at the final location (step 2) or no journey animation
            if (isLocationView || (journeyStep === null && !location.includes(','))) {
              // Add custom marker/pin
              markerRef.current = L.marker([lat, lon], {
                icon: L.icon({
                  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
                  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
                  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                }),
              }).addTo(mapInstanceRef.current);

              // Optional: Add popup with location name
              markerRef.current.bindPopup(`<b>${location}</b>`).openPopup();
            }
            
            // Store current location for next comparison
            previousLocationRef.current = location;
          }
        })
        .catch((error) => {
          console.error("Geocoding error:", error);
        });
    }

    // Cleanup function
    return () => {
      if (markerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }
    };
  }, [location, hasSearched, zoom, journeyStep]);

  // Update zoom when prop changes - use smooth zoom animation
  useEffect(() => {
    if (mapInstanceRef.current && location && mapInstanceRef.current.getCenter) {
      const currentCenter = mapInstanceRef.current.getCenter();
      // Use flyTo for smooth zoom changes
      mapInstanceRef.current.flyTo([currentCenter.lat, currentCenter.lng], zoom, {
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  }, [zoom, location]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // If no location is found and user has searched, show a message
  if (!location && hasSearched) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <p className="text-base font-medium text-[#1A1A1A] mb-2" style={{ fontFamily: "Open Sans" }}>
            Please include a location in your search
          </p>
          <p className="text-sm text-[#575757]" style={{ fontFamily: "Open Sans" }}>
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

  return (
    <div
      className="w-full h-full"
      style={{
        position: "relative",
        backgroundColor: "white",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
    </div>
  );
}
