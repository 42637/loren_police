import { useState } from 'react';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import DetectionCard from '../components/DetectionCard';
import EmptyState from '../components/EmptyState';
import { Camera } from 'lucide-react';

export default function DetectedVehiclesPage() {
  const { detections } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filterOptions = [
    { label: 'All', value: 'ALL', count: detections.length },
    { label: 'Potential Match', value: 'POTENTIAL MATCH', count: detections.filter(d => d.status === 'POTENTIAL MATCH').length },
    { label: 'Review Required', value: 'REVIEW REQUIRED', count: detections.filter(d => d.status === 'REVIEW REQUIRED').length },
    { label: 'Normal', value: 'NORMAL', count: detections.filter(d => d.status === 'NORMAL').length },
    { label: 'Unverified', value: 'UNVERIFIED', count: detections.filter(d => d.verificationStatus === 'UNVERIFIED').length },
  ];

  const filteredDetections = detections.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cameraId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      item.status === statusFilter ||
      (statusFilter === 'UNVERIFIED' && item.verificationStatus === 'UNVERIFIED');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="detected-vehicles-page">
      <div className="page-header">
        <div className="page-title">
          <Camera size={22} color="var(--primary-blue)" />
          <span>Detected Vehicles</span>
        </div>
        <div className="page-subtitle">
          Real-time vehicle detections logged by authorized traffic ANPR cameras.
        </div>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by Vehicle No, Detection ID, Camera ID, Location..."
      />

      <FilterChips
        options={filterOptions}
        activeFilter={statusFilter}
        onSelectFilter={setStatusFilter}
      />

      {filteredDetections.length > 0 ? (
        <div className="grid-2">
          {filteredDetections.map((detection) => (
            <DetectionCard key={detection.id} detection={detection} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No detections found"
          description="There are no camera detections matching your search or filter options."
          actionText="Clear Filters"
          onAction={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
        />
      )}
    </div>
  );
}
