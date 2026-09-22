import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import StolenVehicleCard from '../components/StolenVehicleCard';
import EmptyState from '../components/EmptyState';
import { Car, Plus } from 'lucide-react';

export default function StolenVehiclesPage() {
  const { stolenVehicles } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  const filterOptions = [
    { label: 'All', value: 'ALL', count: stolenVehicles.length },
    { label: 'Active', value: 'ACTIVE', count: stolenVehicles.filter(s => s.status === 'ACTIVE').length },
    { label: 'Detected', value: 'DETECTED', count: stolenVehicles.filter(s => s.status === 'DETECTED').length },
    { label: 'Recovered', value: 'RECOVERED', count: stolenVehicles.filter(s => s.status === 'RECOVERED').length },
    { label: 'Closed', value: 'CLOSED', count: stolenVehicles.filter(s => s.status === 'CLOSED').length },
  ];

  const filteredStolen = stolenVehicles.filter((item) => {
    const matchesSearch =
      item.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.complaintId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="stolen-vehicles-page">
      <div className="page-header-with-action">
        <div className="page-header">
          <div className="page-title">
            <Car size={22} color="var(--primary-blue)" />
            <span>Stolen Vehicles</span>
          </div>
          <div className="page-subtitle">
            Register and monitor reported missing or stolen vehicles.
          </div>
        </div>

        <Link to="/app/stolen/register" className="btn-primary btn-register-stolen">
          <Plus size={18} />
          <span>REGISTER VEHICLE</span>
        </Link>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by Registration No, Make/Model, FIR No..."
      />

      <FilterChips
        options={filterOptions}
        activeFilter={statusFilter}
        onSelectFilter={setStatusFilter}
      />

      {filteredStolen.length > 0 ? (
        <div className="grid-2">
          {filteredStolen.map((vehicle) => (
            <StolenVehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No stolen vehicle records found"
          description="There are no stolen vehicle FIR records matching your search query."
          actionText="+ Register Stolen Vehicle"
          onAction={() => navigate('/app/stolen/register')}
        />
      )}

      <style>{`
        .page-header-with-action {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        @media (min-width: 600px) {
          .page-header-with-action {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
          }
        }

        .btn-register-stolen {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          align-self: flex-start;
          padding: 10px 16px;
        }
      `}</style>
    </div>
  );
}
