import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
// MarkerClusterGroup is added to L namespace after import
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

// Create custom pin icon for company locations with distance badge attached
const createCustomTeardropIcon = (logoUrl = null, size = 50, distanceKm = null) => {
  const boxSize = size;
  
  const iconId = `company-icon-${Math.random().toString(36).substr(2, 9)}`;
  
  // Light blue border color (#87CEEB is sky blue)
  const lightBlueBorder = '#87CEEB';
  
  // Distance badge HTML (attached to icon)
  const badgeHtml = distanceKm !== null ? `
    <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);background-color:#0A0A0A;color:white;border-radius:4px;padding:2px 6px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.3);pointer-events:none;z-index:1000;">
      ${distanceKm} km
    </div>
  ` : '';
  
  // Image fills the entire box (no padding, object-fit: cover to fill background)
  const html = `<div id="${iconId}" class="company-marker" style="position:relative;width:${boxSize}px;height:${boxSize}px;background-color:#FFFFFF;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 2px 8px rgba(0,0,0,0.12),0 1px 3px rgba(0,0,0,0.08);border:2px solid ${lightBlueBorder};cursor:pointer;transition:transform 0.2s ease,box-shadow 0.2s ease;overflow:visible;">
    ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />` : ''}
    ${badgeHtml}
  </div>`;
  
  return L.divIcon({
    html: html,
    className: 'custom-pindrop-marker',
    iconSize: [boxSize, boxSize + (distanceKm !== null ? 20 : 0)],
    iconAnchor: [boxSize / 2, (boxSize + (distanceKm !== null ? 20 : 0)) / 2],
    popupAnchor: [0, -(boxSize + (distanceKm !== null ? 20 : 0)) - 10], // Position tooltip above the top border of the box
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

// Function to fetch road distance from OSRM API (distance only, no path)
const fetchRoadDistance = async (start, end) => {
  try {
    // OSRM API: lon,lat format, overview=false to get only distance
    const url = `http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=false`;
    
    const response = await fetch(url, {
      headers: { "User-Agent": "MandalMinds/1.0" },
    });
    
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      // Return distance in meters
      return data.routes[0].distance;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching road distance:', error);
    return null;
  }
};

export default function GlobeView({ 
  location, 
  hasSearched, 
  zoom = 10, 
  journeyStep = null,
  onLoadingComplete = null,
  onFindingJobsStart = null,
  homeLocation = null,
  showHomeLines = false
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const clusterGroupRef = useRef(null);
  const pinAnimationTimeoutRefs = useRef([]);
  const previousLocationRef = useRef(null);
  const findingJobsCalledRef = useRef(false); // Prevent multiple calls to onFindingJobsStart
  const straightLinesRef = useRef([]); // Store straight lines from home to companies
  const homeMarkerRef = useRef(null); // Store home location marker
  const companyMarkersRef = useRef([]); // Store company markers with distance data
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to get road distance and show on line hover
  const showRoadDistanceOnHover = async (line, company, home) => {
    if (!mapInstanceRef.current || !home || !company || !line) return;

    const homeCoords = [home.lat, home.lon];
    const companyCoords = [company.lat, company.lon];

    // Fetch road distance from OSRM
    const roadDistanceMeters = await fetchRoadDistance(homeCoords, companyCoords);
    
    if (roadDistanceMeters !== null) {
      const roadDistanceKm = (roadDistanceMeters / 1000).toFixed(1);
      
      // Bind tooltip to line showing road distance
      line.bindTooltip(`${company.name || 'Location'}: ${roadDistanceKm} km by road`, {
        permanent: false,
        direction: 'top',
        className: 'road-distance-tooltip'
      });
    }
  };

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

    // Cleanup previous straight lines
    if (straightLinesRef.current && straightLinesRef.current.length > 0) {
      straightLinesRef.current.forEach(line => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(line);
        }
      });
      straightLinesRef.current = [];
    }

    // Cleanup company markers ref
    companyMarkersRef.current = [];

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

          // Journey animation: First show state, then zoom to location, then show companies
          if (isStateView) {
            // Step 1: Show state first
            mapInstanceRef.current.flyTo([lat, lon], zoom, {
              duration: 1.5,
              easeLinearity: 0.25,
            });
          } else if (isLocationView || journeyStep === null) {
            // Signal that we're finding jobs BEFORE zoom starts (so overlay appears during zoom)
            if (companies.length > 0 && !findingJobsCalledRef.current) {
              onFindingJobsStart?.();
              findingJobsCalledRef.current = true;
            }
            
            // Step 2: Zoom to specific location first (journey animation) - happens in background while "Finding jobs..." shows
            mapInstanceRef.current.flyTo([lat, lon], zoom, {
              duration: 2.5,
              easeLinearity: 0.25,
            });
            
            // Then show companies after zoom completes
            if (companies.length > 0) {
              
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

              // Wait for location zoom to complete, then fit bounds to show all companies
              const fitBoundsDelay = 2500; // Wait for flyTo to complete (2.5s duration)
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
                    .home-panel-tooltip {
                      background: white !important;
                      border: 1px solid #E5E5E5 !important;
                      border-radius: 8px !important;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                      padding: 12px !important;
                      font-family: 'Open Sans', sans-serif !important;
                      width: auto !important;
                      min-width: auto !important;
                      max-width: none !important;
                    }
                    .home-panel-tooltip .leaflet-tooltip-content {
                      margin: 0 !important;
                      width: auto !important;
                    }
                  `;
                  document.head.appendChild(style);
                }

                // Add all markers at once (no staggered animation)
                setTimeout(async () => {
                  // Calculate distances for all companies if home location exists
                  const companyDistances = {};
                  if (homeLocation && homeLocation.lat && homeLocation.lon) {
                    await Promise.all(companies.map(async (company) => {
                      const homeCoords = [homeLocation.lat, homeLocation.lon];
                      const companyCoords = [company.lat, company.lon];
                      const roadDistanceMeters = await fetchRoadDistance(homeCoords, companyCoords);
                      if (roadDistanceMeters !== null) {
                        companyDistances[company.name] = (roadDistanceMeters / 1000).toFixed(1);
                      } else {
                        // Fallback to straight-line distance
                        const straightDistance = mapInstanceRef.current.distance(homeCoords, companyCoords);
                        companyDistances[company.name] = (straightDistance / 1000).toFixed(1);
                      }
                    }));
                  }

                  companies.forEach((company, index) => {
                    // Always use uploaded images for Thrissur companies (comp1.png to comp6.png)
                    const logoUrl = index < thrissurCompanyLogos.length ? thrissurCompanyLogos[index] : (company.logoUrl || null);
                    const distanceKm = companyDistances[company.name] || null;
                    const customIcon = createCustomTeardropIcon(
                      logoUrl,
                      50,
                      distanceKm
                    );

                    const marker = L.marker([company.lat, company.lon], {
                      icon: customIcon,
                      zIndexOffset: 1000 + index,
                      opacity: 1,
                    });

                    // Store company data in marker
                    marker.companyData = company;
                    marker.distanceKm = distanceKm;

                    // Add marker to cluster group
                    clusterGroup.addLayer(marker);

                    // Store marker reference
                    companyMarkersRef.current.push(marker);

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
                
                // Add home location marker and draw curved lines if homeLocation is set
                if (homeLocation && homeLocation.lat && homeLocation.lon) {
                  setTimeout(() => {
                    // Add home location pin marker with emoji home icon and white background
                    const homeIcon = L.divIcon({
                      html: `<div style="background-color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid #E5E5E5;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏠</div>`,
                      className: 'home-marker',
                      iconSize: [40, 40],
                      iconAnchor: [20, 20]
                    });

                    const homeMarker = L.marker([homeLocation.lat, homeLocation.lon], {
                      icon: homeIcon,
                      zIndexOffset: 2000,
                      interactive: true
                    }).addTo(mapInstanceRef.current);

                    // Create home panel content with all connected locations (with km labels)
                    const createHomePanelContent = (companiesList) => {
                      if (!companiesList || companiesList.length === 0) return 'No locations';
                      
                      const items = companiesList.map((company, idx) => {
                        const home = [homeLocation.lat, homeLocation.lon];
                        const companyLoc = [company.lat, company.lon];
                        const distance = mapInstanceRef.current.distance(home, companyLoc);
                        const distanceKm = (distance / 1000).toFixed(1);
                        const logoUrl = idx < thrissurCompanyLogos.length ? thrissurCompanyLogos[idx] : (company.logoUrl || null);
                        
                        return `
                          <div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.1);">
                            ${logoUrl ? `<img src="${logoUrl}" style="width:24px;height:24px;border-radius:4px;object-fit:cover;" />` : '<div style="width:24px;height:24px;background:#7c00ff;border-radius:4px;"></div>'}
                            <span style="flex:1;font-size:13px;color:#1A1A1A;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${company.name || 'Location'}</span>
                            <span style="font-size:12px;font-weight:600;color:#0A0A0A;white-space:nowrap;flex-shrink:0;margin-left:4px;">${distanceKm} km</span>
                          </div>
                        `;
                      }).join('');
                      
                      return `
                        <div style="width:auto;max-width:none;overflow:visible;">
                          <div style="font-weight:bold;margin-bottom:8px;color:#1A1A1A;font-size:14px;">Connected Locations</div>
                          ${items}
                        </div>
                      `;
                    };

                    // Bind tooltip with home panel content (click-based, closes on outside click)
                    homeMarker.bindTooltip(createHomePanelContent(companies), {
                      permanent: false,
                      direction: 'right',
                      offset: [10, 0],
                      className: 'home-panel-tooltip',
                      interactive: true
                    });

                    // Show tooltip on click, closes when clicking outside
                    homeMarker.off('click');
                    homeMarker.on('click', function() {
                      if (homeMarker.isTooltipOpen()) {
                        homeMarker.closeTooltip();
                      } else {
                        homeMarker.openTooltip();
                      }
                    });
                    
                    // Close tooltip when clicking on map
                    mapInstanceRef.current.on('click', function() {
                      if (homeMarker.isTooltipOpen()) {
                        homeMarker.closeTooltip();
                      }
                    });

                    homeMarkerRef.current = homeMarker;

                    // Draw straight lines from home to companies ONLY if showHomeLines is true
                    if (showHomeLines) {
                      companies.forEach(async (company) => {
                        const home = [homeLocation.lat, homeLocation.lon];
                        const companyLoc = [company.lat, company.lon];
                        
                        // Create straight line (polyline)
                        const straightLine = L.polyline(
                          [home, companyLoc],
                          {
                            color: '#0A0A0A',
                            weight: 2,
                            opacity: 0.6,
                            dashArray: '5, 5',
                            interactive: true
                          }
                        ).addTo(mapInstanceRef.current);
                        
                        // Add hover handler to show road distance
                        straightLine.on('mouseover', async function() {
                          await showRoadDistanceOnHover(straightLine, company, homeLocation);
                        });
                        
                        straightLine.on('mouseout', function() {
                          straightLine.closeTooltip();
                        });
                        
                        straightLinesRef.current.push(straightLine);
                      });
                    }
                  }, baseDelay + 200);
                }
                
                // Call loading complete callback after all markers are added
                setTimeout(() => {
                  onLoadingComplete?.();
                  console.log('✅ All markers added, loading complete');
                }, baseDelay + 500);
              }, fitBoundsDelay);
            }
          } else {
            // No companies to show - still zoom to geocoded location
            if (isStateView) {
              mapInstanceRef.current.flyTo([lat, lon], zoom, {
                duration: 1.5,
                easeLinearity: 0.25,
              });
            } else if (isLocationView || journeyStep === null) {
              // Zoom to location even when no companies (auto zoom should still happen)
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
  }, [location, hasSearched, zoom, journeyStep, homeLocation, onLoadingComplete, onFindingJobsStart]);

  // Effect to toggle straight lines when showHomeLines changes
  useEffect(() => {
    if (!mapInstanceRef.current || !homeLocation || !homeLocation.lat || !homeLocation.lon) return;
    if (!hasSearched) return;

    // Get companies for current location
    const companies = getCompaniesForLocation(location || '');
    if (companies.length === 0) return;

    // Cleanup existing straight lines
    if (straightLinesRef.current && straightLinesRef.current.length > 0) {
      straightLinesRef.current.forEach(line => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(line);
        }
      });
      straightLinesRef.current = [];
    }

    // Draw straight lines if showHomeLines is true
    if (showHomeLines) {
      console.log('🎯 Drawing straight lines, companies count:', companies.length);
      companies.forEach(async (company) => {
        const home = [homeLocation.lat, homeLocation.lon];
        const companyLoc = [company.lat, company.lon];
        
        // Create straight line (polyline)
        const straightLine = L.polyline(
          [home, companyLoc],
          {
            color: '#0A0A0A',
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 5',
            interactive: true
          }
        ).addTo(mapInstanceRef.current);
        
        // Add hover handler to show road distance
        straightLine.on('mouseover', async function() {
          await showRoadDistanceOnHover(straightLine, company, homeLocation);
        });
        
        straightLine.on('mouseout', function() {
          straightLine.closeTooltip();
        });
        
        straightLinesRef.current.push(straightLine);
      });

      // Update home marker tooltip with current companies
      if (homeMarkerRef.current) {
        const createHomePanelContent = (companiesList) => {
          if (!companiesList || companiesList.length === 0) return 'No locations';
          
          const items = companiesList.map((company, idx) => {
            const home = [homeLocation.lat, homeLocation.lon];
            const companyLoc = [company.lat, company.lon];
            const distance = mapInstanceRef.current.distance(home, companyLoc);
            const distanceKm = (distance / 1000).toFixed(1);
            const logoUrl = idx < thrissurCompanyLogos.length ? thrissurCompanyLogos[idx] : (company.logoUrl || null);
            
            return `
              <div style="display:flex;align-items:center;gap:4px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.1);">
                ${logoUrl ? `<img src="${logoUrl}" style="width:24px;height:24px;border-radius:4px;object-fit:cover;" />` : '<div style="width:24px;height:24px;background:#7c00ff;border-radius:4px;"></div>'}
                <span style="flex:1;font-size:13px;color:#1A1A1A;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${company.name || 'Location'}</span>
                <span style="font-size:12px;font-weight:600;color:#0A0A0A;white-space:nowrap;flex-shrink:0;margin-left:4px;">${distanceKm} km</span>
              </div>
            `;
          }).join('');
          
          return `
            <div style="width:auto;max-width:none;overflow:visible;">
              <div style="font-weight:bold;margin-bottom:8px;color:#1A1A1A;font-size:14px;">Connected Locations</div>
              ${items}
            </div>
          `;
        };

        homeMarkerRef.current.setTooltipContent(createHomePanelContent(companies));
        
        // Ensure click handler is set
        homeMarkerRef.current.off('click');
        homeMarkerRef.current.on('click', function() {
          if (homeMarkerRef.current.isTooltipOpen()) {
            homeMarkerRef.current.closeTooltip();
          } else {
            homeMarkerRef.current.openTooltip();
          }
        });
        
        // Close tooltip when clicking on map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.off('click');
          mapInstanceRef.current.on('click', function() {
            if (homeMarkerRef.current && homeMarkerRef.current.isTooltipOpen()) {
              homeMarkerRef.current.closeTooltip();
            }
          });
        }
      }
    } else {
      console.log('🚫 showHomeLines is false, not drawing lines');
    }
  }, [showHomeLines, homeLocation, location, hasSearched]);

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
    const timeouts = pinAnimationTimeoutRefs.current;
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
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
