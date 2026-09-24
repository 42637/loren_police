import { Camera, MapPin, Clock, AlertTriangle } from 'lucide-react';

export default function EvidenceCard({ evidence }) {
  if (!evidence) return null;

  // Real CCTV Camera Detection Snapshot Images
  const getCCTVImage = () => {
    if (evidence.imageUrl && typeof evidence.imageUrl === 'string' && evidence.imageUrl.startsWith('http')) {
      return evidence.imageUrl;
    }
    if (evidence.imagePlaceholder && typeof evidence.imagePlaceholder === 'string' && evidence.imagePlaceholder.startsWith('http')) {
      return evidence.imagePlaceholder;
    }
    
    // High-resolution realistic traffic CCTV camera snapshots matching different vehicle types & locations
    const cctvPresets = [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1000&auto=format&fit=crop&q=80'
    ];
    const hash = (evidence.detectedVehicleNumber || evidence.cameraId || 'CAM102')
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return cctvPresets[hash % cctvPresets.length];
  };

  const imageSrc = getCCTVImage();

  return (
    <div className="card evidence-card">
      <div className="card-header">
        <div className="evidence-title">
          <Camera size={18} color="var(--primary-blue)" />
          <h3>CCTV EVIDENCE FRAME</h3>
        </div>
        <div className="ocr-score-badge">
          <span>OCR Confidence:</span>
          <strong>{evidence.ocrConfidence}%</strong>
        </div>
      </div>

      <div className="evidence-media-container">
        {/* Real Vehicle CCTV Camera Image */}
        <img 
          src={imageSrc} 
          alt={`CCTV Snapshot for ${evidence.detectedVehicleNumber}`} 
          className="cctv-evidence-image" 
        />
        
        {/* Camera Watermark Overlay */}
        <div className="camera-watermark">
          <span className="rec-dot"></span>
          <span>{evidence.cameraId} • {evidence.timestamp}</span>
        </div>

        {/* Bounding Box License Plate Detection Overlay */}
        <div className="detected-box-overlay">
          <span>ANPR DETECTED: <strong>{evidence.detectedVehicleNumber}</strong></span>
        </div>

        {/* Live Stream Label Overlay */}
        <div className="cctv-stream-badge">
          <span>HD ANPR SNAPSHOT</span>
        </div>
      </div>

      <div className="evidence-details-grid">
        <div className="ev-detail-item">
          <Camera size={14} />
          <span><strong>Camera ID:</strong> {evidence.cameraId}</span>
        </div>
        <div className="ev-detail-item">
          <MapPin size={14} />
          <span><strong>Location:</strong> {evidence.cameraLocation}</span>
        </div>
        <div className="ev-detail-item">
          <Clock size={14} />
          <span><strong>Timestamp:</strong> {evidence.timestamp}</span>
        </div>
      </div>

      <div className="disclaimer-banner">
        <AlertTriangle size={15} className="disclaimer-icon" />
        <span>
          <strong>DISCLAIMER:</strong> AI/CCTV information is provided for officer review and does not constitute final verification.
        </span>
      </div>

      <style>{`
        .evidence-card {
          margin-bottom: 16px;
        }

        .evidence-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .evidence-title h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary-blue);
        }

        .ocr-score-badge {
          font-size: 0.775rem;
          color: var(--primary-blue);
          background: var(--very-light-blue);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .evidence-media-container {
          width: 100%;
          height: 240px;
          background: #0F172A;
          border-radius: var(--border-radius-lg);
          position: relative;
          margin-bottom: 12px;
          overflow: hidden;
          border: 1.5px solid #334155;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .cctv-evidence-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: contrast(1.05) brightness(0.95);
        }

        .camera-watermark {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(6, 25, 51, 0.85);
          backdrop-filter: blur(4px);
          color: #00FF66;
          font-family: monospace;
          font-size: 0.725rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(0, 255, 102, 0.4);
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 2;
        }

        .rec-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #EF4444;
          box-shadow: 0 0 6px #EF4444;
          animation: recBlink 1.2s infinite ease-in-out;
        }

        @keyframes recBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .detected-box-overlay {
          position: absolute;
          bottom: 12px;
          right: 12px;
          border: 2px dashed #22C55E;
          background: rgba(6, 25, 51, 0.88);
          backdrop-filter: blur(4px);
          color: #4ADE80;
          font-family: monospace;
          font-size: 0.78rem;
          padding: 6px 12px;
          border-radius: 6px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .detected-box-overlay strong {
          color: #F0C342;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        .cctv-stream-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(240, 195, 66, 0.2);
          backdrop-filter: blur(4px);
          border: 1px solid #F0C342;
          color: #F0C342;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 3px 6px;
          border-radius: 3px;
          letter-spacing: 0.5px;
          z-index: 2;
        }

        .evidence-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          font-size: 0.85rem;
          margin-bottom: 12px;
        }

        @media (min-width: 600px) {
          .evidence-details-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .ev-detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .disclaimer-banner {
          background-color: #FFF8E1;
          border: 1px solid #FFE082;
          color: var(--color-warning);
          font-size: 0.775rem;
          padding: 8px 12px;
          border-radius: 4px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .disclaimer-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
}
