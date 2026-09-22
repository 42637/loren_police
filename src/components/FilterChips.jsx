export default function FilterChips({ options = [], activeFilter, onSelectFilter }) {
  return (
    <div className="filter-chips-strip" role="tablist" aria-label="Filter records">
      {options.map((option) => {
        const isActive = activeFilter === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`filter-chip ${isActive ? 'active' : ''}`}
            onClick={() => onSelectFilter(option.value)}
          >
            {option.label} {option.count !== undefined ? `(${option.count})` : ''}
          </button>
        );
      })}
    </div>
  );
}
