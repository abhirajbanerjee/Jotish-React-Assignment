export default function SearchBar({ value, onChange, placeholder = 'Search employees...' }) {
    return (
        <div className="search-bar-wrapper">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                className="search-bar"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            {value && (
                <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
                    ✕
                </button>
            )}
        </div>
    );
}
