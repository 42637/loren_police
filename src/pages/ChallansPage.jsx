import { useState } from 'react';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import ChallanCard from '../components/ChallanCard';
import EmptyState from '../components/EmptyState';
import { FileCheck, ArrowUpDown } from 'lucide-react';

export default function ChallansPage() {
  const { challans } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Filter options
  const filterOptions = [
    { label: 'All', value: 'ALL', count: challans.length },
    { label: 'Pending Review', value: 'PENDING REVIEW', count: challans.filter(c => c.status === 'PENDING REVIEW').length },
    { label: 'Under Review', value: 'UNDER REVIEW', count: challans.filter(c => c.status === 'UNDER REVIEW').length },
    { label: 'Verified', value: 'VERIFIED', count: challans.filter(c => c.status === 'VERIFIED').length },
    { label: 'Rejected', value: 'REJECTED', count: challans.filter(c => c.status === 'REJECTED').length },
  ];

  // Filtering logic
  const filteredChallans = challans.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.challanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.challanVehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.claimedVehicle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sorting logic
  const sortedChallans = [...filteredChallans].sort((a, b) => {
    if (sortBy === 'HIGH PRIORITY') {
      const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    }
    if (sortBy === 'OLDEST') {
      return a.id.localeCompare(b.id);
    }
    // Default NEWEST
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="challans-page">
      <div className="page-header">
        <div className="page-title">
          <FileCheck size={22} color="var(--primary-blue)" />
          <span>Challan Verification</span>
        </div>
        <div className="page-subtitle">
          Review disputed challans reported by vehicle owners.
        </div>
      </div>

      {/* Controls Bar: Search & Sort */}
      <div className="challans-controls-row">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by Challan No, Vehicle No, Complaint ID..."
        />

        <div className="sort-container">
          <ArrowUpDown size={14} className="sort-icon" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort records"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="HIGH PRIORITY">High Priority</option>
          </select>
        </div>
      </div>

      {/* Status Filter Chips */}
      <FilterChips
        options={filterOptions}
        activeFilter={statusFilter}
        onSelectFilter={setStatusFilter}
      />

      {/* List / Grid of Cards */}
      {sortedChallans.length > 0 ? (
        <div className="grid-2">
          {sortedChallans.map((challan) => (
            <ChallanCard key={challan.id} challan={challan} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No pending challans found"
          description="No disputed challan complaints match your search or filter options."
          onAction={searchTerm || statusFilter !== 'ALL' ? () => { setSearchTerm(''); setStatusFilter('ALL'); } : null}
          actionText="Clear Filters"
        />
      )}

      <style>{`
        .challans-controls-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (min-width: 640px) {
          .challans-controls-row {
            flex-direction: row;
            align-items: center;
          }
          .challans-controls-row .search-bar-container {
            flex: 1;
            margin-bottom: 0;
          }
        }

        .sort-container {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        @media (min-width: 640px) {
          .sort-container {
            margin-bottom: 0;
          }
        }

        .sort-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .sort-select {
          padding: 10px 12px 10px 32px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          background: #FFFFFF;
          font-size: 0.85rem;
          color: var(--text-primary);
          font-weight: 500;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
