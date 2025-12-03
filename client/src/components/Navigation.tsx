interface NavigationProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export function Navigation({ currentFilter, onFilterChange }: NavigationProps) {
  const filters = [
    { id: 'inbox', label: 'InBox', icon: '📥' },
    { id: 'today', label: 'Today', icon: '📅' },
    { id: 'upcoming', label: '近日予定', icon: '📆' },
    { id: 'completedToday', label: '今日の完了', icon: '✅' },
  ];

  return (
    <nav className="navigation">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`nav-button ${currentFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          <span className="nav-icon">{filter.icon}</span>
          <span className="nav-label">{filter.label}</span>
        </button>
      ))}
    </nav>
  );
}
