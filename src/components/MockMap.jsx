import { MapPin, Camera, Shield, AlertTriangle } from 'lucide-react';

export default function MockMap({ 
  markers = [], 
  height = "240px" 
}) {
  return (
    <div className="mock-map-container" style={{ height }}>
      <div className="map-demo-badge">DEMO MAP</div>

      {/* Grid background simulation */}
      <div className="map-labels-bg">
        <span className="road-label r1">NH-216 Bypass</span>
        <span className="road-label r2">Main Road</span>
        <span className="road-label r3">Station Road</span>
      </div>

      {/* Render Markers */}
      {markers.map((marker, idx) => {
        let PinIcon = MapPin;
        let pinClass = 'map-marker-pin';
        if (marker.type === 'stolen') {
          PinIcon = AlertTriangle;
          pinClass += ' stolen';
        } else if (marker.type === 'camera') {
          PinIcon = Camera;
          pinClass += ' camera';
        } else if (marker.type === 'station') {
          PinIcon = Shield;
        }

        const topPos = marker.top || `${30 + (idx * 25) % 50}%`;
        const leftPos = marker.left || `${25 + (idx * 30) % 60}%`;

        return (
          <div key={idx} className="map-marker" style={{ top: topPos, left: leftPos }}>
            <div className={pinClass}>
              <PinIcon size={14} />
            </div>
            <div className="map-marker-label">{marker.label}</div>
          </div>
        );
      })}

      <style>{`
        .map-labels-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.4;
        }
        .road-label {
          position: absolute;
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .r1 { top: 20%; left: 10%; transform: rotate(-10deg); }
        .r2 { top: 50%; right: 15%; transform: rotate(15deg); }
        .r3 { bottom: 20%; left: 30%; }
      `}</style>
    </div>
  );
}
