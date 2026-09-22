import { useState } from 'react';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import CameraCard from '../components/CameraCard';
import EmptyState from '../components/EmptyState';
import { Video, Activity, Radio, AlertCircle, Wrench } from 'lucide-react';

export default function CamerasPage() {
  const { cameras } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const totalCount = cameras.length;
  const onlineCount = cameras.filter(c => c.status === 'ONLINE').length;
  const offlineCount = cameras.filter(c => c.status === 'OFFLINE').length;
  const maintCount = cameras.filter(c => c.status === 'MAINTENANCE').length;

  const filterOptions = [
    { label: 'All', value: 'ALL', count: totalCount },
    { label: 'Online', value: 'ONLINE', count: onlineCount },
    { label: 'Offline', value: 'OFFLINE', count: offlineCount },
    { label: 'Maintenance', value: 'MAINTENANCE', count: maintCount },
  ];

  const filteredCameras = cameras.filter((cam) => {
    const matchesSearch =
      cam.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cam.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cam.zone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || cam.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="cameras-page">
      <div className="page-header">
        <div className="page-title">
          <Video size={22} color="var(--primary-blue)" />
          <span>Camera Monitoring</span>
        </div>
        <div className="page-subtitle">
          Monitor operational status and detection statistics across traffic CCTV network.
        </div>
      </div>

      {/* Stats Overview Bar */}
      <div className="camera-stats-bar card">
        <div className="stat-pill total">
          <Activity size={16} />
          <span>Total Cameras: <strong>{totalCount}</strong></span>
        </div>
        <div className="stat-pill online">
          <Radio size={16} />
          <span>Online: <strong>{onlineCount}</strong></span>
        </div>
        <div className="stat-pill offline">
          <AlertCircle size={16} />
          <span>Offline: <strong>{offlineCount}</strong></span>
        </div>
        <div className="stat-pill maint">
          <Wrench size={16} />
          <span>Maintenance: <strong>{maintCount}</strong></span>
        </div>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by Camera ID, Location, Zone..."
      />

      <FilterChips
        options={filterOptions}
        activeFilter={statusFilter}
        onSelectFilter={setStatusFilter}
      />

      {filteredCameras.length > 0 ? (
        <div className="grid-2">
          {filteredCameras.map((camera) => (
            <CameraCard key={camera.id} camera={camera} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No cameras found"
          description="No CCTV cameras match your current search or status filter criteria."
          actionText="Clear Filters"
          onAction={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
        />
      )}

      <style>{`
        .cameras-page {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .camera-stats-bar {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 14px;
        }

        @media (min-width: 768px) {
          .camera-stats-bar {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          padding: 8px 12px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }

        .stat-pill.total { background: var(--very-light-blue); color: var(--primary-blue); border-color: var(--border-light); }
        .stat-pill.online { background: var(--color-success-bg); color: var(--color-success); border-color: var(--color-success-border); }
        .stat-pill.offline { background: var(--color-neutral-bg); color: var(--color-neutral); border-color: var(--color-neutral-border); }
        .stat-pill.maint { background: var(--color-warning-bg); color: var(--color-warning); border-color: var(--color-warning-border); }
      `}</style>
    </div>
  );
}
