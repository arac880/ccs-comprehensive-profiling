import styles from "../../styles/SearchBar.module.css";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
}) {
  const handleKey = (e) => {
    if (e.key === "Enter" && onSearch) onSearch(value);
  };

  return (
    <div className={styles.searchWrap}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
      />
      <button
        className={styles.searchBtn}
        onClick={() => onSearch && onSearch(value)}
      >
        <i className="bi bi-search" />
      </button>
    </div>
  );
}
