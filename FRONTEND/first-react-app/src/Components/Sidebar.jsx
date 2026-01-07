export default function Sidebar({ onSelect }) {
    return (
        <aside className="sidebar">
            <h3><center>Reports</center></h3>
            <br />

            <ul>
                <li onClick={() => onSelect("sales")}>Sales Report</li>
                <li onClick={() => onSelect("employee")}>Employee Report</li>
                <li onClick={() => onSelect("tds")}>TDS Report</li>

                <li onClick={() => onSelect("bank")}>Bank Account Summary</li>
                <li onClick={() => onSelect("loan")}>Loan Distribution</li>

            </ul>
        </aside>
    );
}
