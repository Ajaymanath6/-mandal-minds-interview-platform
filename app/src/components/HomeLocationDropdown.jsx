import { useState, useRef, useEffect } from "react";
import { RiSearchLine } from "@remixicon/react";

export default function HomeLocationDropdown({
  isOpen,
  onClose,
  dropdownRef,
  position = { top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' },
  width = '300px',
  homeLocation = null,
  onSelect
}) {
  const [searchQuery, setSearchQuery] = useState(
    homeLocation?.query || homeLocation?.displayName || (homeLocation?.lat && homeLocation?.lon ? `${homeLocation.lat}, ${homeLocation.lon}` : "10.368495, 76.219310")
  );
  const [isGeocoding, setIsGeocoding] = useState(false);
  const searchInputRef = useRef(null);

  // Update searchQuery when homeLocation changes
  useEffect(() => {
    if (homeLocation) {
      setSearchQuery(homeLocation.query || homeLocation.displayName || (homeLocation.lat && homeLocation.lon ? `${homeLocation.lat}, ${homeLocation.lon}` : "10.368495, 76.219310"));
    } else {
      setSearchQuery("10.368495, 76.219310");
    }
  }, [homeLocation]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Geocode location to get coordinates
  const handleLocationSelect = async () => {
    if (!searchQuery.trim()) {
      if (onSelect) {
        onSelect(null);
      }
      onClose();
      return;
    }

    setIsGeocoding(true);
    try {
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;
      const response = await fetch(geocodeUrl, {
        headers: {
          "User-Agent": "MandalMinds/1.0",
        },
      });
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const displayName = data[0].display_name;
        
        if (onSelect) {
          onSelect({
            query: searchQuery,
            lat,
            lon,
            displayName
          });
        }
      } else {
        // Still save the query even if geocoding fails
        if (onSelect) {
          onSelect({
            query: searchQuery,
            lat: null,
            lon: null,
            displayName: searchQuery
          });
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      // Still save the query even if geocoding fails
      if (onSelect) {
        onSelect({
          query: searchQuery,
          lat: null,
          lon: null,
          displayName: searchQuery
        });
      }
    } finally {
      setIsGeocoding(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute bg-white rounded-lg border z-50 flex flex-col"
      style={{
        width: width,
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
        marginTop: position.marginTop || '0',
        marginBottom: position.marginBottom || '0',
        padding: '12px',
        gap: '12px',
        borderColor: '#E5E5E5',
        borderWidth: '1px',
        boxShadow: '0px 10px 10px -5px #0000000A, 0px 20px 25px -5px #0000001A',
        borderRadius: '8px',
      }}
    >
      <div className="text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: 'Open Sans' }}>
        Home Location
      </div>
      
      {/* Search Input */}
      <div className="relative">
        <RiSearchLine 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          style={{ color: '#A5A5A5' }}
        />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleLocationSelect();
            }
          }}
          placeholder="10.368495, 76.219310"
          className="w-full pl-10 pr-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#7c00ff] text-sm"
          style={{ 
            fontFamily: 'Open Sans', 
            color: '#1A1A1A',
          }}
        />
        <style>{`
          input::placeholder {
            color: #A5A5A5 !important;
          }
        `}</style>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleLocationSelect}
          disabled={isGeocoding}
          className="flex-1 px-4 py-2 bg-[#7c00ff] text-white rounded-lg text-sm font-medium hover:bg-[#6a00e6]] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Open Sans' }}
        >
          {isGeocoding ? 'Finding...' : 'Set Location'}
        </button>
        {homeLocation && (
          <button
            onClick={() => {
              setSearchQuery("");
              if (onSelect) {
                onSelect(null);
              }
              onClose();
            }}
            className="px-4 py-2 bg-transparent border border-[#E5E5E5] text-[#575757] rounded-lg text-sm font-medium hover:bg-[#F5F5F5] transition-colors"
            style={{ fontFamily: 'Open Sans' }}
          >
            Clear
          </button>
        )}
      </div>
      
      {homeLocation && (
        <div className="text-xs text-[#575757] pt-2 border-t border-[#E5E5E5]" style={{ fontFamily: 'Open Sans' }}>
          Current: {homeLocation.displayName || homeLocation.query}
        </div>
      )}
    </div>
  );
}

