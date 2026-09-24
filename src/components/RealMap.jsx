import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Camera, Shield, AlertTriangle, Layers, ExternalLink, Navigation } from 'lucide-react';

export default function RealMap({ 
  markers = [], 
  lat: propLat, 
  lng: propLng, 
  locationName = "Main Road, Bhimavaram",
  height = "260px",
  zoom = 15
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [mapType, setMapType] = useState('street'); // 'street' or 'satellite'

  // Default coordinates fallback (Bhimavaram Traffic Control Room Zone A)
  const defaultLat = 16.5449;
  const defaultLng = 81.5212;

  // Determine active center coordinates
  const activeLat = parseFloat(
    markers[0]?.lat || propLat || (markers[0]?.type === 'stolen' ? 16.5480 : defaultLat)
  ) || defaultLat;

  const activeLng = parseFloat(
    markers[0]?.lng || propLng || (markers[0]?.type === 'stolen' ? 81.5300 : defaultLng)
  ) || defaultLng;

  // Tile layer URLs
  const streetTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const satelliteTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map instances
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [activeLat, activeLng],
        zoom: zoom,
        zoomControl: true,
        attributionControl: false
      });

      // Add Base Tile Layer
      const baseLayer = L.tileLayer(streetTileUrl, {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Create Layer Group for Markers
      const layerGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current.tileLayer = baseLayer;
    } else {
      mapInstanceRef.current.setView([activeLat, activeLng], zoom);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mapType changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (mapInstanceRef.current.tileLayer) {
      mapInstanceRef.current.removeLayer(mapInstanceRef.current.tileLayer);
    }

    const newUrl = mapType === 'satellite' ? satelliteTileUrl : streetTileUrl;
    const newLayer = L.tileLayer(newUrl, {
      maxZoom: mapType === 'satellite' ? 18 : 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.tileLayer = newLayer;
  }, [mapType]);

  // Update Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    const activeMarkersList = markers.length > 0 ? markers : [
      {
        lat: activeLat,
        lng: activeLng,
        label: locationName,
        type: 'camera'
      }
    ];

    activeMarkersList.forEach((markerData) => {
      const mLat = parseFloat(markerData.lat) || activeLat;
      const mLng = parseFloat(markerData.lng) || activeLng;
      const mType = markerData.type || 'camera';
      const mLabel = markerData.label || 'Detection Spot';

      // SVG Icon string depending on type
      let iconColor = '#0B4F8A';
      let bgColor = '#0B4F8A';
      let pinSymbol = '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>';

      if (mType === 'stolen') {
        iconColor = '#DC2626';
        bgColor = '#DC2626';
        pinSymbol = '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"></path>';
      } else if (mType === 'camera') {
        iconColor = '#061933';
        bgColor = '#061933';
        pinSymbol = '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>';
      }

      const customDivIcon = L.divIcon({
        className: 'custom-leaflet-marker-box',
        html: `
          <div className="real-pin-wrapper type-${mType}">
            <div className="real-pin-pulse"></div>
            <div className="real-pin-badge" style="background-color: ${bgColor}; border: 2px solid #F0C342;">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                ${pinSymbol}
              </svg>
            </div>
            <div className="real-pin-label">${mLabel}</div>
          </div>
        `,
        iconSize: [120, 50],
        iconAnchor: [60, 25],
        popupAnchor: [0, -25]
      });

      const leafletMarker = L.marker([mLat, mLng], { icon: customDivIcon }).addTo(layerGroupRef.current);

      // Popup Content
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <div style="font-weight: 800; color: #061933; font-size: 0.9rem; margin-bottom: 2px;">
            ${mLabel}
          </div>
          <div style="font-size: 0.75rem; color: #486581; margin-bottom: 6px;">
            📍 ${locationName}
          </div>
          <div style="font-size: 0.7rem; font-family: monospace; background: #F0F4F8; padding: 3px 6px; border-radius: 4px; color: #102A43; display: inline-block;">
            GPS: ${mLat.toFixed(4)}, ${mLng.toFixed(4)}
          </div>
        </div>
      `;

      leafletMarker.bindPopup(popupHtml);
    });
  }, [markers, activeLat, activeLng, locationName]);

  const googleMapsUrl = `https://www.google.com/maps?q=${activeLat},${activeLng}`;

  return (
    <div className="real-map-wrapper" style={{ height }}>
      {/* Map Control Bar Overlay */}
      <div className="map-top-control-bar">
        <div className="map-live-badge">
          <span className="live-dot-pulse"></span>
          <span>LIVE SUPABASE MAP</span>
        </div>

        <div className="map-controls-group">
          {/* Layer Switcher */}
          <button
            type="button"
            className={`map-ctrl-btn ${mapType === 'street' ? 'active' : ''}`}
            onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
            title="Toggle Satellite / Street View"
          >
            <Layers size={13} />
            <span>{mapType === 'street' ? 'Satellite' : 'Street'}</span>
          </button>

          {/* External Google Maps Link */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-ctrl-btn google-link-btn"
            title="Open Exact GPS Location in Google Maps"
          >
            <ExternalLink size={13} />
            <span>Open Maps</span>
          </a>
        </div>
      </div>

      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="leaflet-map-dom" />

      {/* Bottom Coordinates Overlay Strip */}
      <div className="map-bottom-coord-bar">
        <Navigation size={12} color="#F0C342" />
        <span>GPS Location: <strong>{activeLat.toFixed(4)}° N, {activeLng.toFixed(4)}° E</strong></span>
      </div>

      <style>{`
        .real-map-wrapper {
          position: relative;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          background: #E6EDF5;
        }

        .leaflet-map-dom {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .map-top-control-bar {
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .map-live-badge {
          pointer-events: auto;
          background: rgba(6, 25, 51, 0.88);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          border: 1px solid rgba(240, 195, 66, 0.5);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .live-dot-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
          animation: pulseGreen 1.5s infinite ease-in-out;
        }

        @keyframes pulseGreen {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }

        .map-controls-group {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .map-ctrl-btn {
          background: #FFFFFF;
          color: #061933;
          border: 1px solid #CBD5E1;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
          transition: all 0.15s ease;
          text-decoration: none;
        }

        .map-ctrl-btn:hover {
          background: #F0C342;
          color: #061933;
          border-color: #F0C342;
          text-decoration: none;
        }

        .map-ctrl-btn.active {
          background: #061933;
          color: #F0C342;
          border-color: #F0C342;
        }

        .google-link-btn {
          background: #FFFFFF;
          color: #1E293B;
        }

        .map-bottom-coord-bar {
          position: absolute;
          bottom: 6px;
          left: 8px;
          z-index: 10;
          background: rgba(6, 25, 51, 0.85);
          backdrop-filter: blur(4px);
          color: #D5E5F2;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.68rem;
          display: flex;
          align-items: center;
          gap: 5px;
          border: 1px solid rgba(240, 195, 66, 0.3);
          pointer-events: none;
        }

        .map-bottom-coord-bar strong {
          color: #F0C342;
        }

        /* Marker Styles inside Leaflet */
        .custom-leaflet-marker-box {
          background: transparent !important;
          border: none !important;
        }

        .real-pin-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .real-pin-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
          position: relative;
          z-index: 2;
        }

        .real-pin-pulse {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(220, 38, 38, 0.3);
          animation: mapPinPulse 1.8s infinite ease-out;
          z-index: 1;
        }

        .real-pin-wrapper.type-camera .real-pin-pulse {
          background: rgba(11, 79, 138, 0.3);
        }

        @keyframes mapPinPulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .real-pin-label {
          margin-top: 2px;
          background: rgba(6, 25, 51, 0.92);
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #F0C342;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          z-index: 3;
        }
      `}</style>
    </div>
  );
}
