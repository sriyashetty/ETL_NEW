import { useState } from "react";

export default function Sidebar({ onSelect }) {
  const [activeItem, setActiveItem] = useState("sales");

  const menuItemStyle = (isActive) => ({
    padding: "12px 16px",
    marginBottom: "6px",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.2s ease",
    backgroundColor: isActive ? "#e0f2fe" : "transparent",
    color: isActive ? "#0369a1" : "#334155",
    fontWeight: isActive ? "600" : "400",
  });

  return (
    <aside style={{ padding: "20px", width: "240px", background: "#f8fafc" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Reports</h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li
          style={menuItemStyle(activeItem === "sales")}
          onClick={() => {
            setActiveItem("sales");
            onSelect("sales");
          }}
        >
          Sales Report
        </li>

        <li
          style={menuItemStyle(activeItem === "employee")}
          onClick={() => {
            setActiveItem("employee");
            onSelect("employee");
          }}
        >
          Employee Report
        </li>

        <li
          style={menuItemStyle(activeItem === "tds")}
          onClick={() => {
            setActiveItem("tds");
            onSelect("tds");
          }}
        >
          TDS Report
        </li>

        <li
          style={menuItemStyle(activeItem === "bank")}
          onClick={() => {
            setActiveItem("bank");
            onSelect("bank");
          }}
        >
          Bank Account Summary
        </li>

        <li
          style={menuItemStyle(activeItem === "loan")}
          onClick={() => {
            setActiveItem("loan");
            onSelect("loan");
          }}
        >
          Loan Distribution
        </li>
      </ul>
    </aside>
  );
}
