import React, { useEffect, useState, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapLegend from './MapLegend';

const checkIsSelected = (sel, name, fullName) => {
  if (!sel) return false;
  const clean = (s) => (s || '').toLowerCase().replace(/kabupaten|kota|kab|city|kab\.|kota\./g, '').trim();
  
  const cleanSel = clean(sel);
  const cleanName = clean(name);
  const cleanFull = clean(fullName);
  
  return cleanSel === cleanName || cleanSel === cleanFull;
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'aman': 
    case 'stabil': return '#10b981';
    case 'waspada': return '#f59e0b';
    case 'kritis': 
    case 'bahaya': return '#e11d48';
    default: return '#64748b';
  }
};

const createPopupHTML = (feature) => {
  const name = feature.properties.name || feature.properties.NAME || 'Unknown Region';
  const status = (feature.properties.status || 'NORMAL').toUpperCase();
  const statusColor = getStatusColor(status);
  
  const price = feature.properties.price || 0;
  const trend = feature.properties.trend || 'stable';
  const lastUpdate = feature.properties.lastUpdate || 'Just Now';
  
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);

  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  const trendClass = trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-emerald-400' : 'text-blue-400';

  return `
    <div class="p-4 min-w-[220px] bg-gray-900/95 backdrop-blur-xl text-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
      <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full -mr-12 -mt-12 pointer-events-none"></div>
      
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[8px] uppercase tracking-[0.2em] text-gray-500 font-black">Region Overview</span>
          <span class="text-[8px] text-gray-600 font-bold">${lastUpdate}</span>
        </div>

        <div class="mb-4">
          <h3 class="text-xl font-black text-white tracking-tight leading-none mb-1">${name}</h3>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${statusColor}"></span>
            <span class="text-[9px] font-black uppercase tracking-widest" style="color: ${statusColor}">${status}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
          <div class="flex flex-col">
            <span class="text-[8px] text-gray-500 font-black uppercase mb-1">Current Price</span>
            <span class="text-sm font-black text-emerald-400">${formattedPrice}</span>
          </div>
          <div class="flex flex-col border-l border-white/10 pl-3">
            <span class="text-[8px] text-gray-500 font-black uppercase mb-1">Trend</span>
            <div class="flex items-center gap-1">
              <span class="text-xs font-black ${trendClass}">${trendIcon}</span>
              <span class="text-[9px] font-black uppercase ${trendClass}">${trend}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const getFeatureBounds = (feature) => {
  let minLng = Infinity, minLat = Infinity;
  let maxLng = -Infinity, maxLat = -Infinity;

  const processCoords = (coords) => {
    if (Array.isArray(coords[0])) {
      coords.forEach(processCoords);
    } else {
      const [lng, lat] = coords;
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    }
  };

  if (feature.geometry && feature.geometry.coordinates) {
    processCoords(feature.geometry.coordinates);
  }

  return [[minLng, minLat], [maxLng, maxLat]];
};

const getProcessedGeoData = (geoData, selectedRegion) => {
  if (!geoData) return null;
  
  const processedFeatures = (geoData.features || []).map((feature, idx) => {
    const nameProp = feature.properties.name || feature.properties.NAME || '';
    const fullNameProp = feature.properties.fullRegionName || '';
    const isSelected = checkIsSelected(selectedRegion, nameProp, fullNameProp);
    const statusColor = getStatusColor(feature.properties.status);
    
    return {
      ...feature,
      id: idx,
      properties: {
        ...feature.properties,
        isSelected,
        statusColor
      }
    };
  });

  return {
    ...geoData,
    features: processedFeatures
  };
};

const MapVisualizer = ({ geoData, selectedRegion, onRegionClick }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const prevRegionRef = useRef(null);
  
  const [isMoving, setIsMoving] = useState(false);
  const [isMapLocked, setIsMapLocked] = useState(() => window.innerWidth < 1024);

  // Initialize Map
  useEffect(() => {
    if (!geoData || !mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'cartodb-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© CartoDB'
          }
        },
        layers: [
          {
            id: 'cartodb-dark-layer',
            type: 'raster',
            source: 'cartodb-dark',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: [112.238, -7.536],
      zoom: window.innerWidth < 1024 ? 7 : 8,
      attributionControl: false,
      dragRotate: true,
      pitchWithRotate: true
    });

    mapRef.current = map;

    map.on('load', () => {
      const processedGeoData = getProcessedGeoData(geoData, selectedRegion);

      map.addSource('regions', {
        type: 'geojson',
        data: processedGeoData
      });

      // Add fill layer
      map.addLayer({
        id: 'regions-fill',
        type: 'fill',
        source: 'regions',
        paint: {
          'fill-color': ['get', 'statusColor'],
          'fill-opacity': [
            'case',
            ['boolean', ['get', 'isSelected'], false], 0.85,
            ['boolean', ['feature-state', 'hover'], false], 0.75,
            0.45
          ]
        }
      });

      // Add outline layer
      map.addLayer({
        id: 'regions-outline',
        type: 'line',
        source: 'regions',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['get', 'isSelected'], false], ['get', 'statusColor'],
            '#0f172a'
          ],
          'line-width': [
            'case',
            ['boolean', ['get', 'isSelected'], false], 3.5,
            1.0
          ]
        }
      });

      // Set transitions
      map.setPaintProperty('regions-fill', 'fill-opacity-transition', { duration: 0 });
      map.setPaintProperty('regions-outline', 'line-opacity-transition', { duration: 0 });

      // Setup event handlers
      setupMapEvents(map);

      // Trigger initial camera focus if region pre-selected
      if (selectedRegion) {
        refocusCamera(selectedRegion, processedGeoData, true);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geoData]);

  // Setup Event Handlers
  const setupMapEvents = (map) => {
    const hoveredFeatureIdRef = { current: null };

    map.on('mousemove', 'regions-fill', (e) => {
      if (e.features.length > 0) {
        if (hoveredFeatureIdRef.current !== null) {
          map.setFeatureState(
            { source: 'regions', id: hoveredFeatureIdRef.current },
            { hover: false }
          );
        }

        const sortedFeatures = [...e.features].sort((a, b) => {
          const aName = (a.properties.name || '').toUpperCase();
          const bName = (b.properties.name || '').toUpperCase();
          const aIsCity = aName.includes('KOTA');
          const bIsCity = bName.includes('KOTA');
          if (aIsCity && !bIsCity) return -1;
          if (!aIsCity && bIsCity) return 1;
          return 0;
        });

        const feature = sortedFeatures[0];
        hoveredFeatureIdRef.current = feature.id;
        map.setFeatureState(
          { source: 'regions', id: feature.id },
          { hover: true }
        );

        map.getCanvas().style.cursor = 'pointer';
      }
    });

    map.on('mouseleave', 'regions-fill', () => {
      if (hoveredFeatureIdRef.current !== null) {
        map.setFeatureState(
          { source: 'regions', id: hoveredFeatureIdRef.current },
          { hover: false }
        );
        hoveredFeatureIdRef.current = null;
      }
      map.getCanvas().style.cursor = '';
    });

    map.on('click', 'regions-fill', (e) => {
      if (e.features.length > 0) {
        const sortedFeatures = [...e.features].sort((a, b) => {
          const aName = (a.properties.name || '').toUpperCase();
          const bName = (b.properties.name || '').toUpperCase();
          const aIsCity = aName.includes('KOTA');
          const bIsCity = bName.includes('KOTA');
          if (aIsCity && !bIsCity) return -1;
          if (!aIsCity && bIsCity) return 1;
          return 0;
        });

        const feature = sortedFeatures[0];
        const fullRegionName = feature.properties.fullRegionName || feature.properties.name;
        onRegionClick(fullRegionName);
      }
    });

    map.on('movestart', () => {
      setIsMoving(true);
    });

    map.on('moveend', () => {
      setIsMoving(false);
    });
  };

  // Refocus Camera logic
  const refocusCamera = (region, data, isInitial = false) => {
    const map = mapRef.current;
    if (!map) return;

    const isMobile = window.innerWidth < 1024;

    if (region && data) {
      const feature = data.features.find(f => {
        const name = f.properties.name || f.properties.NAME || '';
        const fullName = f.properties.fullRegionName || '';
        return checkIsSelected(region, name, fullName);
      });

      if (feature) {
        const bounds = getFeatureBounds(feature);
        const lng = (bounds[0][0] + bounds[1][0]) / 2;
        const lat = (bounds[0][1] + bounds[1][1]) / 2;

        map.fitBounds(bounds, {
          padding: isMobile ? 80 : 150,
          duration: isInitial ? 0 : 1500,
          pitch: 45,
          maxZoom: 9
        });

        if (popupRef.current) {
          popupRef.current.remove();
        }
        popupRef.current = new maplibregl.Popup({
          closeButton: false,
          offset: [0, -10],
          className: 'custom-popup'
        })
          .setLngLat([lng, lat])
          .setHTML(createPopupHTML(feature))
          .addTo(map);
      }
    } else if (!region) {
      map.easeTo({
        center: [112.238, -7.536],
        zoom: isMobile ? 7 : 8,
        pitch: 0,
        bearing: 0,
        duration: isInitial ? 0 : 1500
      });

      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    }
  };

  // Handle Dynamic Selection & Data Changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoData) return;

    const processedGeoData = getProcessedGeoData(geoData, selectedRegion);
    
    const source = map.getSource('regions');
    if (source) {
      source.setData(processedGeoData);
    }

    if (selectedRegion !== prevRegionRef.current) {
      prevRegionRef.current = selectedRegion;
      refocusCamera(selectedRegion, processedGeoData, false);
    }
  }, [selectedRegion, geoData]);

  // Handle Mobile Scroll Locking Controls
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (isMapLocked) {
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();
    } else {
      map.dragPan.enable();
      map.scrollZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoomRotate.enable();
    }
  }, [isMapLocked, isMoving]);

  return (
    <div className={`flex-1 w-full h-full relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl transition-all duration-700 ${isMoving ? 'map-moving' : ''}`}>
      <div ref={mapContainerRef} className="w-full h-full" style={{ background: '#020617' }} />
      
      {/* Mobile Map Scroll Lock Toggle Overlay */}
      <button
        type="button"
        onClick={() => setIsMapLocked(!isMapLocked)}
        className="absolute top-3 left-3 z-[1000] lg:hidden px-3.5 py-2 bg-gray-950/90 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-wider rounded-xl text-gray-200 flex items-center gap-2 shadow-2xl active:scale-95 transition-all"
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: isMapLocked ? '#64748b' : '#10b981' }}></span>
        {isMapLocked ? '🔒 Peta Terkunci (Scroll)' : '🔓 Peta Aktif (Geser)'}
      </button>

      {!selectedRegion && <MapLegend />}
    </div>
  );
};

export default MapVisualizer;
