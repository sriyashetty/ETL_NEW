export default function FilterPanel({
  filters,
  onChange,
  onSearch,
  onClear,
  loading
}) {
  const isDisabled =
    loading || Object.values(filters).every(v => !v.trim());

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "16px 24px",
        borderBottom: "1px solid #f1f5f9",
        background: "#fff",
        flexWrap: "wrap"
      }}
    >
      <input
        placeholder="Account No"
        value={filters.account_no}
        onChange={(e) =>
          onChange({ ...filters, account_no: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Customer ID"
        value={filters.customer_id}
        onChange={(e) =>
          onChange({ ...filters, customer_id: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Branch Code"
        value={filters.branch_code}
        onChange={(e) =>
          onChange({ ...filters, branch_code: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Product Code"
        value={filters.product_code}
        onChange={(e) =>
          onChange({ ...filters, product_code: e.target.value })
        }
        style={inputStyle}
      />

      {/* Search Button */}
      <button
        onClick={onSearch}
        disabled={isDisabled}
        title={isDisabled ? "Enter at least one filter" : ""}
        style={{
          padding: "10px 20px",
          background: "#2563eb", // 🔵 Always blue
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {/* Clear Button */}
      <button
        onClick={onClear}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#e5e7eb",
          color: "#111827",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        Clear
      </button>
    </div>
  );
}

const inputStyle = {
  width: "220px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  outline: "none"
};
