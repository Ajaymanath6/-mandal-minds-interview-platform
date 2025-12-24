import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
// MarkerClusterGroup is added to L namespace after import
import { createPinDropIcon } from "./PinDrop";
import MapLoader from "./MapLoader";
import CompanyDetailsDrawer from "./CompanyDetailsDrawer";
import mockJobs from "../data/mockJobs.json";

// Fix for default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Create custom pin icon for company locations
const createCustomTeardropIcon = (logoUrl = null, iconColor = '#7c00ff', size = 50, jobCount = 0) => {
  const boxSize = size;
  const logoSize = size * 0.7;
  const padding = size * 0.15;
  
  const iconId = `company-icon-${Math.random().toString(36).substr(2, 9)}`;
  
  const html = `<div id="${iconId}" class="company-marker" style="width:${boxSize}px;height:${boxSize}px;background-color:#FFFFFF;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:${padding}px;box-shadow:0 2px 8px rgba(0,0,0,0.12),0 1px 3px rgba(0,0,0,0.08);border:1px solid rgba(0,0,0,0.05);cursor:pointer;transition:transform 0.2s ease,box-shadow 0.2s ease;">
    ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="width:${logoSize}px;height:${logoSize}px;object-fit:contain;" onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='block';" />
    <svg width="${logoSize}" height="${logoSize}" viewBox="0 0 32 32" style="display:none;">
      <path d="M16,2A11.0134,11.0134,0,0,0,5,13a10.8885,10.8885,0,0,0,2.2163,6.6s.3.3945.3482.4517L16,30l8.439-9.9526c.0444-.0533.3447-.4478.3447-.4478l.0015-.0024A10.8846,10.8846,0,0,0,27,13,11.0134,11.0134,0,0,0,16,2Zm1,16H15V16h2Zm0-4H15V12h2Zm4,4H19V10H13v8H11V10a2.0023,2.0023,0,0,1,2-2h6a2.0023,2.0023,0,0,1,2,2Z" fill="${iconColor}" />
    </svg>` : `<svg width="${logoSize}" height="${logoSize}" viewBox="0 0 32 32">
      <path d="M16,2A11.0134,11.0134,0,0,0,5,13a10.8885,10.8885,0,0,0,2.2163,6.6s.3.3945.3482.4517L16,30l8.439-9.9526c.0444-.0533.3447-.4478.3447-.4478l.0015-.0024A10.8846,10.8846,0,0,0,27,13,11.0134,11.0134,0,0,0,16,2Zm1,16H15V16h2Zm0-4H15V12h2Zm4,4H19V10H13v8H11V10a2.0023,2.0023,0,0,1,2-2h6a2.0023,2.0023,0,0,1,2,2Z" fill="${iconColor}" />
    </svg>`}
    ${jobCount > 0 ? `<div style="position:absolute;top:-6px;right:-6px;background-color:#EC4899;color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-center;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);">${jobCount}</div>` : ''}
  </div>`;
  
  return L.divIcon({
    html: html,
    className: 'custom-pindrop-marker',
    iconSize: [boxSize, boxSize],
    iconAnchor: [boxSize / 2, boxSize / 2],
    popupAnchor: [0, -boxSize / 2 - 5],
  });
};

// Helper function to calculate optimal padding based on pin count
const calculateOptimalPadding = (pinCount) => {
  if (pinCount <= 3) return 80;
  if (pinCount <= 10) return 120;
  return 150;
};

// Helper function to get companies for a location
const getCompaniesForLocation = (location) => {
  if (!location) return [];
  
  const normalizedLocation = location.toLowerCase().trim();
  
  // Extract key location words (city/district names)
  const locationWords = normalizedLocation.split(/[,\s]+/).filter(word => word.length > 2);
  
  // Check if location matches any company location
  const matchingCompanies = mockJobs.companies.filter(company => {
    const companyLocation = company.address.toLowerCase();
    const companyWords = companyLocation.split(/[,\s]+/).filter(word => word.length > 2);
    
    // Check if any location word matches any company location word
    const hasMatch = locationWords.some(locWord => 
      companyWords.some(compWord => 
        compWord.includes(locWord) || locWord.includes(compWord)
      )
    );
    
    return hasMatch || companyLocation.includes(normalizedLocation) || 
           normalizedLocation.includes(companyLocation.split(',')[0].toLowerCase());
  });
  
  // If no match, check for common location aliases
  const locationAliases = {
    'thrissur': ['thrissur', 'trichur', 'trissur'],
    'kochi': ['kochi', 'cochin', 'ernakulam', 'ekm'],
    'kerala': ['kerala', 'kerela']
  };
  
  // Check if location matches any alias
  for (const [key, aliases] of Object.entries(locationAliases)) {
    if (aliases.some(alias => normalizedLocation.includes(alias))) {
      // For thrissur, return all companies (they're all in Thrissur)
      if (key === 'thrissur') {
        return mockJobs.companies;
      }
      // For other locations, try to match
      break;
    }
  }
  
  // If still no match but location contains 'thrissur' or 'trichur', return all companies
  if (matchingCompanies.length === 0 && (normalizedLocation.includes('thrissur') || normalizedLocation.includes('trichur'))) {
    return mockJobs.companies;
  }
  
  return matchingCompanies;
};

export default function GlobeView({ 
  location, 
  searchQuery, 
  hasSearched, 
  zoom = 10, 
  journeyStep = null,
  onLocationChange = null 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const clusterGroupRef = useRef(null);
  const tooltipRef = useRef(null);
  const pinAnimationTimeoutRefs = useRef([]);
  const previousLocationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
        zoomAnimation: true,
        zoomAnimationThreshold: 4,
      }).setView([0, 0], zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Main effect: Handle location changes and display companies
  useEffect(() => {
    if (!location || !hasSearched || !mapInstanceRef.current) return;

    setIsLoading(true);
    
    // Safety timeout: ensure loading is cleared after 10 seconds max
    let safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    // Cleanup previous markers and clusters
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    if (clusterGroupRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current = null;
    }

    // Geocode location
    const isPincode = /^\d{6}$/.test(location.trim());
    const geocodeUrl = isPincode
      ? `https://nominatim.openstreetmap.org/search?format=json&postalcode=${location.trim()}&country=India&limit=1`
      : `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;

    fetch(geocodeUrl, {
      headers: { "User-Agent": "MandalMinds/1.0" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          const isStateView = journeyStep === 1;
          const isLocationView = journeyStep === 2;

          // Fly to location
          if (isStateView) {
            mapInstanceRef.current.flyTo([lat, lon], zoom, {
              duration: 1.5,
              easeLinearity: 0.25,
            });
          } else if (isLocationView) {
            mapInstanceRef.current.flyTo([lat, lon], zoom, {
              duration: 2.5,
              easeLinearity: 0.25,
            });
          } else {
            mapInstanceRef.current.flyTo([lat, lon], zoom, {
              duration: 1.5,
              easeLinearity: 0.25,
            });
          }

          // Get companies for this location
          const companies = getCompaniesForLocation(location);
          
          // Debug: Log to console to see what's happening
          console.log('🔍 Location search:', location);
          console.log('📍 Companies found:', companies.length);
          console.log('🎯 isLocationView:', isLocationView, 'journeyStep:', journeyStep);
          console.log('✅ Will show companies?', companies.length > 0 && (isLocationView || journeyStep === null || journeyStep === 2));

          // Show companies if we have them and we're not in state view (step 1)
          // Allow showing in location view (step 2) or when journeyStep is null (direct search)
          if (companies.length > 0 && !isStateView) {
            
            // Calculate bounds
            const lats = companies.map(c => c.lat);
            const lons = companies.map(c => c.lon);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLon = Math.min(...lons);
            const maxLon = Math.max(...lons);

            const latPadding = (maxLat - minLat) * 0.1;
            const lonPadding = (maxLon - minLon) * 0.1;

            const bounds = L.latLngBounds(
              [minLat - latPadding, minLon - lonPadding],
              [maxLat + latPadding, maxLon + lonPadding]
            );

            // Wait then fit bounds
            const fitBoundsDelay = 1000;
            setTimeout(() => {
              const padding = calculateOptimalPadding(companies.length);
              mapInstanceRef.current.flyToBounds(bounds, {
                padding: L.point(padding, padding),
                duration: 1.5,
                easeLinearity: 0.25,
                maxZoom: 16,
              });

              // After fitBounds, add markers with clustering
              const fitBoundsDuration = 1500;
              const baseDelay = fitBoundsDelay + fitBoundsDuration;
              const pinDelay = 300;

              // Create cluster group
              const clusterGroup = new L.markerClusterGroup({
                chunkedLoading: true,
                maxClusterRadius: 50,
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                iconCreateFunction: function(cluster) {
                  const count = cluster.getChildCount();
                  return L.divIcon({
                    html: `<div style="background-color:#7c00ff;color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
                    className: 'marker-cluster-custom',
                    iconSize: L.point(40, 40),
                  });
                },
              });

              // Add CSS styles once
              if (!document.getElementById('pinBounceStyle')) {
                const style = document.createElement('style');
                style.id = 'pinBounceStyle';
                style.textContent = `
                  @keyframes pinBounce {
                    0% { transform: scale(0) translateY(0); opacity: 0; }
                    50% { transform: scale(1.2) translateY(-10px); opacity: 1; }
                    70% { transform: scale(0.9) translateY(3px); }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                  }
                  .leaflet-marker-icon.pin-bounce-animate {
                    animation: pinBounce 0.6s ease-out forwards !important;
                  }
                  .company-marker:hover {
                    transform: scale(1.05) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
                  }
                  @keyframes ripple {
                    0% {
                      transform: scale(0);
                      opacity: 1;
                    }
                    100% {
                      transform: scale(2);
                      opacity: 0;
                    }
                  }
                  .company-marker:active::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(124, 0, 255, 0.3);
                    transform: translate(-50%, -50%) scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                  }
                `;
                document.head.appendChild(style);
              }

              companies.forEach((company, index) => {
                const delay = baseDelay + (index * pinDelay);

                const timeoutId = setTimeout(() => {
                  const jobCount = company.jobs?.length || 0;
                  const customIcon = createCustomTeardropIcon(
                    company.logoUrl || null,
                    '#7c00ff',
                    50,
                    jobCount
                  );

                  const marker = L.marker([company.lat, company.lon], {
                    icon: customIcon,
                    zIndexOffset: 1000 + index,
                    opacity: 1,
                  });

                  // Store company data in marker
                  marker.companyData = company;

                  // Add marker to cluster group first (needed to get element)
                  clusterGroup.addLayer(marker);

                  // Bouncy animation - get element after adding to cluster
                  setTimeout(() => {
                    const markerElement = marker.getElement();
                    if (markerElement) {
                      markerElement.style.transform = 'scale(0)';
                      markerElement.style.opacity = '0';
                      setTimeout(() => {
                        markerElement.classList.add('pin-bounce-animate');
                      }, 10);
                    }
                  }, 50);

                  // Hover tooltip
                  marker.on('mouseover', function(e) {
                    const company = marker.companyData;
                    if (company) {
                      setHoveredCompany(company);
                      const latlng = e.latlng;
                      const point = mapInstanceRef.current.latLngToContainerPoint(latlng);
                      setTooltipPosition({ x: point.x, y: point.y - 60 });
                    }
                  });

                  marker.on('mouseout', function() {
                    setTimeout(() => setHoveredCompany(null), 200);
                  });

                  // Click handler - open drawer
                  marker.on('click', function() {
                    setSelectedCompany(marker.companyData);
                    setIsDrawerOpen(true);
                  });

                  console.log('✅ Added marker for:', company.name, 'at', company.lat, company.lon);
                }, delay);

                pinAnimationTimeoutRefs.current.push(timeoutId);
              });

              // Add cluster group to map immediately (markers will be added to it as they're created)
              mapInstanceRef.current.addLayer(clusterGroup);
              clusterGroupRef.current = clusterGroup;
              console.log('✅ Cluster group added to map with', companies.length, 'companies');
              
              // Set loading to false after all markers are added
              setTimeout(() => {
                setIsLoading(false);
                clearTimeout(safetyTimeout);
                console.log('✅ All markers added, loading complete');
              }, baseDelay + (companies.length * pinDelay) + 500);
            }, fitBoundsDelay);
          } else {
            // No companies to show or not in location view, hide loading
            setIsLoading(false);
            clearTimeout(safetyTimeout);
          }

          previousLocationRef.current = location;
        } else {
          setIsLoading(false);
          clearTimeout(safetyTimeout);
        }
      })
      .catch((error) => {
        console.error("Geocoding error:", error);
        setIsLoading(false);
        clearTimeout(safetyTimeout);
      });
    
    // Cleanup safety timeout
    return () => {
      clearTimeout(safetyTimeout);
    };
  }, [location, hasSearched, zoom, journeyStep]);

  // Update zoom when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && location && mapInstanceRef.current.getCenter) {
      const currentCenter = mapInstanceRef.current.getCenter();
      mapInstanceRef.current.flyTo([currentCenter.lat, currentCenter.lng], zoom, {
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  }, [zoom, location]);

  // Cleanup
  useEffect(() => {
    return () => {
      pinAnimationTimeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      if (mapInstanceRef.current) {
        if (clusterGroupRef.current) {
          mapInstanceRef.current.removeLayer(clusterGroupRef.current);
        }
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Tooltip component
  const Tooltip = ({ company, position }) => {
    if (!company) return null;
    const jobCount = company.jobs?.length || 0;

    return (
      <div
        className="absolute pointer-events-none z-[1500] bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translateX(-50%)',
          fontFamily: 'Open Sans',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="w-8 h-8 rounded object-contain"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
              {company.name}
            </p>
            <p className="text-xs" style={{ color: '#575757' }}>
              {jobCount} {jobCount === 1 ? 'position' : 'positions'} open
            </p>
          </div>
        </div>
        <p className="text-xs" style={{ color: '#575757' }}>
          {company.address}
        </p>
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid white',
          }}
        />
      </div>
    );
  };

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

  if (!location && !hasSearched) {
    return (
      <div className="w-full h-full bg-white" />
    );
  }

  return (
    <div
      className="w-full h-full relative"
      style={{
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      {isLoading && <MapLoader message="Finding jobs..." />}
      
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      <Tooltip company={hoveredCompany} position={tooltipPosition} />

      <CompanyDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
      />
    </div>
  );
}
