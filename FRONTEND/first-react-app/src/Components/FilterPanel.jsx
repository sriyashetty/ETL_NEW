export default function FilterPanel({
  value,
  onChange,
  onSearch,
  loading,
  placeholder = "Enter value"
}) {
  return (
    <div style={{
      display: "flex",
      gap: "12px",
      padding: "16px 24px",
      borderBottom: "1px solid #f1f5f9",
      background: "#fff"
    }}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          outline: "none"
        }}
      />

      <button
        onClick={onSearch}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
