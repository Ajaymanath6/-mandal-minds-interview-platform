import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
// MarkerClusterGroup is added to L namespace after import
import { createPinDropIcon } from "./PinDrop";
import CompanyDetailsDrawer from "./CompanyDetailsDrawer";
import mockJobs from "../data/mockJobs.json";

// Fix for default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Logo URLs for Thrissur companies (5 logos from public folder)
// First company: comp1.png, Second: comp2.png, Third: comp4.png, Fourth: comp5.png, Fifth: comp6.png
const thrissurCompanyLogos = [
  '/comp1.png',
  '/comp2.png',
  '/comp4.png',
  '/comp5.png',
  '/comp6.png',
];

// Create custom pin icon for company locations
const createCustomTeardropIcon = (logoUrl = null, iconColor = '#7c00ff', size = 50, jobCount = 0) => {
  const boxSize = size;
  
  const iconId = `company-icon-${Math.random().toString(36).substr(2, 9)}`;
  
  // Light blue border color (#87CEEB is sky blue)
  const lightBlueBorder = '#87CEEB';
  
  // Image fills the entire box (no padding, object-fit: cover to fill background)
  const html = `<div id="${iconId}" class="company-marker" style="width:${boxSize}px;height:${boxSize}px;background-color:#FFFFFF;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 2px 8px rgba(0,0,0,0.12),0 1px 3px rgba(0,0,0,0.08);border:2px solid ${lightBlueBorder};cursor:pointer;transition:transform 0.2s ease,box-shadow 0.2s ease;overflow:hidden;">
    ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />` : ''}
  </div>`;
  
  return L.divIcon({
    html: html,
    className: 'custom-pindrop-marker',
    iconSize: [boxSize, boxSize],
    iconAnchor: [boxSize / 2, boxSize / 2],
    popupAnchor: [0, -boxSize - 10], // Position tooltip above the top border of the box
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

// Export getCompaniesForLocation for use in other components
export { getCompaniesForLocation };

export default function GlobeView({ 
  location, 
  searchQuery, 
  hasSearched, 
  zoom = 10, 
  journeyStep = null,
  onLocationChange = null,
  onLoadingComplete = null,
  onFindingJobsStart = null
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const clusterGroupRef = useRef(null);
  const pinAnimationTimeoutRefs = useRef([]);
  const previousLocationRef = useRef(null);
  const findingJobsCalledRef = useRef(false); // Prevent multiple calls to onFindingJobsStart
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    
    // Reset findingJobsCalledRef when location changes
    findingJobsCalledRef.current = false;

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
            // Signal that we're finding jobs (only once per location)
            if (!findingJobsCalledRef.current) {
              onFindingJobsStart?.();
              findingJobsCalledRef.current = true;
            }
            
            // Skip flyTo to geocoded location - go directly to fitBounds to show all companies
            
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
              // Set initial zoom to show clusters (badges) - zoom level should be < 15 to show clusters
              // disableClusteringAtZoom is 15, so zoom < 15 shows clusters, zoom >= 15 shows individual pins
              const normalizedLocation = location?.toLowerCase().trim() || '';
              const isThrissur = normalizedLocation.includes('thrissur') || normalizedLocation.includes('trichur');
              // Use zoom 12 for Thrissur to show cluster badge initially, user can zoom in manually to see individual pins
              const maxZoomLevel = isThrissur && companies.length >= 5 ? 12 : 14; // Show clusters initially
              
              mapInstanceRef.current.flyToBounds(bounds, {
                padding: L.point(padding, padding),
                duration: 1.5,
                easeLinearity: 0.25,
                maxZoom: maxZoomLevel,
              });

              // After fitBounds, add markers with clustering (all at once, no staggered animation)
              const fitBoundsDuration = 1500;
              const baseDelay = fitBoundsDelay + fitBoundsDuration;

              // Create cluster group with proper clustering behavior
              const clusterGroup = new L.markerClusterGroup({
                chunkedLoading: true,
                maxClusterRadius: 80, // Increased radius for better clustering
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                disableClusteringAtZoom: 15, // Disable clustering at zoom 15+ to show individual pins
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

              // Add all markers at once (no staggered animation)
              setTimeout(() => {
                companies.forEach((company, index) => {
                  // Always use uploaded images for Thrissur companies (comp1.png to comp6.png)
                  const logoUrl = index < thrissurCompanyLogos.length ? thrissurCompanyLogos[index] : (company.logoUrl || null);
                  const customIcon = createCustomTeardropIcon(
                    logoUrl,
                    '#7c00ff',
                    50,
                    0 // Remove jobCount badge
                  );

                  const marker = L.marker([company.lat, company.lon], {
                    icon: customIcon,
                    zIndexOffset: 1000 + index,
                    opacity: 1,
                  });

                  // Store company data in marker
                  marker.companyData = company;

                  // Add marker to cluster group
                  clusterGroup.addLayer(marker);

                  // Click handler - open drawer
                  marker.on('click', function() {
                    setSelectedCompany(marker.companyData);
                    setIsDrawerOpen(true);
                  });

                  console.log('✅ Added marker for:', company.name, 'at', company.lat, company.lon);
                });
              }, baseDelay);

              // Add cluster group to map immediately (markers will be added to it as they're created)
              mapInstanceRef.current.addLayer(clusterGroup);
              clusterGroupRef.current = clusterGroup;
              console.log('✅ Cluster group added to map with', companies.length, 'companies');
              
              // Call loading complete callback after all markers are added
              setTimeout(() => {
                onLoadingComplete?.();
                console.log('✅ All markers added, loading complete');
              }, baseDelay + 500);
            }, fitBoundsDelay);
          } else {
            // No companies to show - fly to geocoded location
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
            // Call loading complete when no companies
            onLoadingComplete?.();
          }

          previousLocationRef.current = location;
        } else {
          // No geocoding data - call loading complete
          onLoadingComplete?.();
        }
      })
      .catch((error) => {
        console.error("Geocoding error:", error);
        onLoadingComplete?.();
      });
  }, [location, hasSearched, zoom, journeyStep, onLoadingComplete, onFindingJobsStart]);

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
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

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
