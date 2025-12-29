import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
// MarkerClusterGroup is added to L namespace after import
import "@elfalem/leaflet-curve";
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
const createCustomTeardropIcon = (logoUrl = null, size = 50) => {
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

// Function to fetch road path from OSRM API
const fetchRoadPath = async (start, end) => {
  try {
    // OSRM API: lon,lat format
    const url = `http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    
    const response = await fetch(url, {
      headers: { "User-Agent": "MandalMinds/1.0" },
    });
    
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      // Return GeoJSON geometry coordinates
      return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert [lon, lat] to [lat, lon]
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching road path:', error);
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
  const curvesRef = useRef([]); // Store curve lines
  const homeMarkerRef = useRef(null); // Store home location marker
  const roadPathsRef = useRef([]); // Store road path polylines
  const distanceBadgesRef = useRef([]); // Store distance badge markers
  const companyMarkersRef = useRef([]); // Store company markers for hover handlers
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to show road path on hover
  const showRoadPath = React.useCallback(async (company, home) => {
    if (!mapInstanceRef.current || !home || !company) return;

    // Cleanup existing road paths
    if (roadPathsRef.current && roadPathsRef.current.length > 0) {
      roadPathsRef.current.forEach(path => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(path);
        }
      });
      roadPathsRef.current = [];
    }

    const homeCoords = [home.lat, home.lon];
    const companyCoords = [company.lat, company.lon];

    // Fetch road path from OSRM
    const roadPathCoords = await fetchRoadPath(homeCoords, companyCoords);

    if (roadPathCoords && roadPathCoords.length > 0) {
      // Create polyline for road path (black color)
      const roadPath = L.polyline(roadPathCoords, {
        color: '#000000',
        weight: 3,
        opacity: 0.8,
        zIndexOffset: 1500
      }).addTo(mapInstanceRef.current);

      roadPathsRef.current.push(roadPath);
    }
  }, []);

  // Function to hide road path
  const hideRoadPath = React.useCallback(() => {
    if (roadPathsRef.current && roadPathsRef.current.length > 0) {
      roadPathsRef.current.forEach(path => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(path);
        }
      });
      roadPathsRef.current = [];
    }
  }, []);

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

    // Cleanup previous curves
    if (curvesRef.current && curvesRef.current.length > 0) {
      curvesRef.current.forEach(curve => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(curve);
        }
      });
      curvesRef.current = [];
    }

    // Cleanup previous road paths
    if (roadPathsRef.current && roadPathsRef.current.length > 0) {
      roadPathsRef.current.forEach(path => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(path);
        }
      });
      roadPathsRef.current = [];
    }

    // Cleanup previous distance badges
    if (distanceBadgesRef.current && distanceBadgesRef.current.length > 0) {
      distanceBadgesRef.current.forEach(badge => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(badge);
        }
      });
      distanceBadgesRef.current = [];
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
                    }
                    .home-panel-tooltip .leaflet-tooltip-content {
                      margin: 0 !important;
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
                      50
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

                    // Store marker reference for hover handlers
                    companyMarkersRef.current.push(marker);

                    // Click handler - open drawer
                    marker.on('click', function() {
                      setSelectedCompany(marker.companyData);
                      setIsDrawerOpen(true);
                    });

                    // Hover handlers for road path display
                    if (homeLocation && homeLocation.lat && homeLocation.lon) {
                      marker.on('mouseover', function() {
                        showRoadPath(company, homeLocation);
                      });

                      marker.on('mouseout', function() {
                        hideRoadPath();
                      });
                    }

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
                    // Add home location pin marker
                    const homeIcon = L.divIcon({
                      html: `<div style="background-color:#7c00ff;color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏠</div>`,
                      className: 'home-marker',
                      iconSize: [40, 40],
                      iconAnchor: [20, 20]
                    });

                    const homeMarker = L.marker([homeLocation.lat, homeLocation.lon], {
                      icon: homeIcon,
                      zIndexOffset: 2000,
                      interactive: true
                    }).addTo(mapInstanceRef.current);

                    // Create home panel content with all connected locations
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
                            <span style="flex:1;font-size:13px;color:#1A1A1A;">${company.name || 'Location'}</span>
                            <span style="font-size:12px;font-weight:bold;color:#7c00ff;">${distanceKm} km</span>
                          </div>
                        `;
                      }).join('');
                      
                      return `
                        <div style="max-width:250px;max-height:300px;overflow-y:auto;">
                          <div style="font-weight:bold;margin-bottom:8px;color:#1A1A1A;font-size:14px;">Connected Locations</div>
                          ${items}
                        </div>
                      `;
                    };

                    // Bind tooltip with home panel content (hover-only)
                    homeMarker.bindTooltip(createHomePanelContent(companies), {
                      permanent: false,
                      direction: 'right',
                      offset: [10, 0],
                      className: 'home-panel-tooltip',
                      interactive: true
                    });

                    homeMarkerRef.current = homeMarker;

                    // Draw curved lines from home to companies ONLY if showHomeLines is true
                    if (showHomeLines) {
                      companies.forEach((company) => {
                      const home = [homeLocation.lat, homeLocation.lon];
                      const companyLoc = [company.lat, company.lon];
                      
                      // Calculate distance in meters
                      const distance = mapInstanceRef.current.distance(home, companyLoc);
                      const distanceKm = (distance / 1000).toFixed(1);
                      
                      // Calculate control points for curved line (Bézier curve)
                      // Control points are offset to create a nice arc
                      const midLat = (home[0] + companyLoc[0]) / 2;
                      const offset = 0.1; // Adjust this to change curve height
                      const controlPoint1 = [midLat + offset, home[1]];
                      const controlPoint2 = [midLat + offset, companyLoc[1]];
                      
                      // Create curved line using SVG path commands
                      const curve = L.curve(
                        [
                          'M', home,          // Move to home location
                          'C', controlPoint1, // Control point 1
                               controlPoint2, // Control point 2
                               companyLoc     // End at company location
                        ],
                        {
                          color: '#7c00ff',
                          weight: 2,
                          opacity: 0.6,
                          dashArray: '5, 5',
                          interactive: true
                        }
                      ).addTo(mapInstanceRef.current);
                      
                      // Add hover handlers to curved line for road path display
                      curve.on('mouseover', function() {
                        showRoadPath(company, homeLocation);
                      });

                      curve.on('mouseout', function() {
                        hideRoadPath();
                      });
                      
                      // Add distance label next to destination icon (Option A)
                      // Position badge slightly below the company icon
                      const badgeLat = companyLoc[0] - 0.001; // Slightly south of icon
                      const badgeLon = companyLoc[1];
                      
                      const label = L.marker([badgeLat, badgeLon], {
                        icon: L.divIcon({
                          html: `<div style="background-color:rgba(124,0,255,0.9);color:white;border-radius:4px;padding:2px 6px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.3);pointer-events:none;">${distanceKm} km</div>`,
                          className: 'distance-label',
                          iconSize: [60, 20],
                          iconAnchor: [30, 20] // Anchor at top center, badge appears below
                        }),
                        interactive: false,
                        zIndexOffset: 500
                      }).addTo(mapInstanceRef.current);
                      
                        curvesRef.current.push(curve);
                        distanceBadgesRef.current.push(label);
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
  }, [location, hasSearched, zoom, journeyStep, homeLocation, onLoadingComplete, onFindingJobsStart, showRoadPath, hideRoadPath]);

  // Effect to toggle curved lines when showHomeLines changes
  useEffect(() => {
    if (!mapInstanceRef.current || !homeLocation || !homeLocation.lat || !homeLocation.lon) return;
    if (!hasSearched) return;

    // Get companies for current location
    const companies = getCompaniesForLocation(location || '');
    if (companies.length === 0) return;

    // Cleanup existing curves
    if (curvesRef.current && curvesRef.current.length > 0) {
      curvesRef.current.forEach(curve => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(curve);
        }
      });
      curvesRef.current = [];
    }

    // Cleanup existing distance badges
    if (distanceBadgesRef.current && distanceBadgesRef.current.length > 0) {
      distanceBadgesRef.current.forEach(badge => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(badge);
        }
      });
      distanceBadgesRef.current = [];
    }

    // Draw curves if showHomeLines is true
    if (showHomeLines) {
      console.log('🎯 Drawing curved lines, companies count:', companies.length);
      companies.forEach((company) => {
        const home = [homeLocation.lat, homeLocation.lon];
        const companyLoc = [company.lat, company.lon];
        
        // Calculate distance in meters
        const distance = mapInstanceRef.current.distance(home, companyLoc);
        const distanceKm = (distance / 1000).toFixed(1);
        
        // Calculate control points for curved line (Bézier curve)
        const offset = 0.1;
        const midLat = (home[0] + companyLoc[0]) / 2;
        const controlPoint1 = [midLat + offset, home[1]];
        const controlPoint2 = [midLat + offset, companyLoc[1]];
        
        // Create curved line - check if L.curve exists
        if (typeof L.curve === 'function') {
          const curve = L.curve(
            [
              'M', home,
              'C', controlPoint1,
                   controlPoint2,
                   companyLoc
            ],
            {
              color: '#7c00ff',
              weight: 2,
              opacity: 0.6,
              dashArray: '5, 5',
              interactive: true
            }
          ).addTo(mapInstanceRef.current);
        
          // Add hover handlers to curved line for road path display
          curve.on('mouseover', function() {
            showRoadPath(company, homeLocation);
          });

          curve.on('mouseout', function() {
            hideRoadPath();
          });
        
          // Add distance label next to destination icon (Option A)
          // Position badge slightly below the company icon
          const badgeLat = companyLoc[0] - 0.001; // Slightly south of icon
          const badgeLon = companyLoc[1];
          
          const label = L.marker([badgeLat, badgeLon], {
            icon: L.divIcon({
              html: `<div style="background-color:rgba(124,0,255,0.9);color:white;border-radius:4px;padding:2px 6px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.3);pointer-events:none;">${distanceKm} km</div>`,
              className: 'distance-label',
              iconSize: [60, 20],
              iconAnchor: [30, 20] // Anchor at top center, badge appears below
            }),
            interactive: false,
            zIndexOffset: 500
          }).addTo(mapInstanceRef.current);
        
          curvesRef.current.push(curve);
          distanceBadgesRef.current.push(label);
        } else {
          console.error('❌ L.curve is not available. Check if @elfalem/leaflet-curve is properly imported.');
        }
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
              <div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.1);">
                ${logoUrl ? `<img src="${logoUrl}" style="width:24px;height:24px;border-radius:4px;object-fit:cover;" />` : '<div style="width:24px;height:24px;background:#7c00ff;border-radius:4px;"></div>'}
                <span style="flex:1;font-size:13px;color:#1A1A1A;">${company.name || 'Location'}</span>
                <span style="font-size:12px;font-weight:bold;color:#7c00ff;">${distanceKm} km</span>
              </div>
            `;
          }).join('');
          
          return `
            <div style="max-width:250px;max-height:300px;overflow-y:auto;">
              <div style="font-weight:bold;margin-bottom:8px;color:#1A1A1A;font-size:14px;">Connected Locations</div>
              ${items}
            </div>
          `;
        };

        homeMarkerRef.current.setTooltipContent(createHomePanelContent(companies));
      }
    } else {
      console.log('🚫 showHomeLines is false, not drawing curves');
    }
  }, [showHomeLines, homeLocation, location, hasSearched, showRoadPath, hideRoadPath]);

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
