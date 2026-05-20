import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapLegend from './MapLegend';

const MapController = ({ selectedRegion, geoData, isMapLocked }) => {
  const map = useMap();
  
  // Initialize City Pane for Z-index control inside the correct context
  useEffect(() => {
    if (map && !map.getPane('cityPane')) {
      const pane = map.createPane('cityPane');
      pane.style.zIndex = 650;
      pane.style.pointerEvents = 'none';
    }
  }, [map]);

  // Handle dynamic scroll-locking via direct Leaflet instances
  useEffect(() => {
    if (map) {
      if (isMapLocked) {
        map.dragging.disable();
        if (map.touchZoom) map.touchZoom.disable();
      } else {
        map.dragging.enable();
        if (map.touchZoom) map.touchZoom.enable();
      }
    }
  }, [map, isMapLocked]);

  useEffect(() => {
    // Force Leaflet to recalculate its size after a small delay to handle responsive shifts
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map, selectedRegion]);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    
    if (selectedRegion && geoData) {
      const feature = geoData.features.find(f => {
        const name = f.properties.name || f.properties.NAME || '';
        const fullName = f.properties.fullRegionName || '';
        
        // Clean and match
        const clean = (s) => s.toLowerCase().replace(/kabupaten|kota|kab|city|kab\.|kota\./g, '').trim();
        return clean(name) === clean(selectedRegion) || clean(fullName) === clean(selectedRegion);
      });
      
      if (feature) {
        const layer = L.geoJSON(feature);
        map.flyToBounds(layer.getBounds(), { 
          padding: isMobile ? [80, 80] : [150, 150], 
          duration: 1.5,
          maxZoom: 9 
        });
      }
    } else if (!selectedRegion) {
      const defaultZoom = isMobile ? 7 : 8;
      map.flyTo([-7.536, 112.238], defaultZoom, { duration: 1.5 });
      map.closePopup();
    }

  }, [selectedRegion, geoData, map]);
  
  return null;
};


const MapVisualizer = ({ geoData, selectedRegion, onRegionClick }) => {
  const geoJsonRef = React.useRef(null);
  
  // Mobile Map Scroll Lock (Lock dragging on mobile by default to allow easy scrolling)
  const [isMapLocked, setIsMapLocked] = useState(() => {
    return window.innerWidth < 1024;
  });

  // Helper function to check selection state with prefix cleanups
  const checkIsSelected = (sel, name, fullName) => {
    if (!sel) return false;
    const clean = (s) => (s || '').toLowerCase().replace(/kabupaten|kota|kab|city|kab\.|kota\./g, '').trim();
    
    const cleanSel = clean(sel);
    const cleanName = clean(name);
    const cleanFull = clean(fullName);
    
    return cleanSel === cleanName || cleanSel === cleanFull;
  };

  // Update styles and open popup manually when selectedRegion changes
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle(mapStyle);
      
      if (selectedRegion) {
        geoJsonRef.current.eachLayer((layer) => {
          const name = layer.feature.properties.name || layer.feature.properties.NAME || '';
          const fullName = layer.feature.properties.fullRegionName || '';
          
          if (checkIsSelected(selectedRegion, name, fullName)) {
            layer.openPopup();
          }
        });
      }
    }
  }, [selectedRegion]);


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

  const mapStyle = (feature) => {
    const name = (feature.properties.name || feature.properties.NAME || '').toUpperCase();
    const isKota = name.includes('KOTA');
    const nameProp = feature.properties.name || feature.properties.NAME || '';
    const fullNameProp = feature.properties.fullRegionName || '';
    
    const isSelected = checkIsSelected(selectedRegion, nameProp, fullNameProp);
    const statusColor = getStatusColor(feature.properties.status);
    
    return {
      color: isSelected ? statusColor : '#0f172a',
      weight: isSelected ? 4 : 1,
      opacity: 1,
      fillColor: statusColor,
      fillOpacity: isSelected ? 0.85 : 0.45,
      pane: isKota ? 'cityPane' : 'overlayPane'
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.name || feature.properties.NAME || 'Unknown Region';
    const status = (feature.properties.status || 'NORMAL').toUpperCase();
    const statusColor = getStatusColor(status);
    
    const nameUpper = name.toUpperCase();
    if (nameUpper.includes('KOTA')) {
      layer.options.pane = 'cityPane';
    }

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

    layer.bindPopup(
      `<div class="p-4 min-w-[220px] bg-gray-900/95 backdrop-blur-xl text-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
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
      </div>`,
      { className: 'custom-popup', maxWidth: 300, offset: [0, -10] }
    );

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        const nameProp = feature.properties.name || feature.properties.NAME || '';
        const fullNameProp = feature.properties.fullRegionName || '';
        
        if (!checkIsSelected(selectedRegion, nameProp, fullNameProp)) {
          l.setStyle({ 
            fillOpacity: 0.8, 
            weight: 3, 
            color: statusColor,
            fillColor: statusColor
          });
          if (!nameUpper.includes('KOTA')) {
            l.bringToFront();
          }
        }
      },
      mouseout: (e) => {
        const l = e.target;
        const nameProp = feature.properties.name || feature.properties.NAME || '';
        const fullNameProp = feature.properties.fullRegionName || '';
        
        if (!checkIsSelected(selectedRegion, nameProp, fullNameProp)) {
          l.setStyle({ 
            fillOpacity: 0.45, 
            weight: 1, 
            color: '#0f172a' 
          });
        }
      },
      click: () => {
        const fullRegionName = feature.properties.fullRegionName || name;
        onRegionClick(fullRegionName);
      }
    });
  };

  return (
    <div className="flex-1 w-full h-full relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
      <MapContainer 
        center={[-7.536, 112.238]} 
        zoom={8} 
        style={{ height: '100%', width: '100%', background: '#020617' }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapController selectedRegion={selectedRegion} geoData={geoData} isMapLocked={isMapLocked} />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution=""
        />
        
        {geoData && (
          <GeoJSON 
            ref={geoJsonRef}
            key={`geojson-${geoData.features.map(f => f.properties.status).join(',')}`}
            data={geoData} 
            style={mapStyle}
            onEachFeature={onEachFeature}
          />
        )}

      </MapContainer>
      
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
