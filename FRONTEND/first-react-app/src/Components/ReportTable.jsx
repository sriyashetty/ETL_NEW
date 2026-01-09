import { useEffect, useState } from "react";
import axios from "axios";
import BankPieChart from "./BankPieChart";
import LoanBarChart from "./LoanBarChart";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FilterPanel from "./FilterPanel";

export default function ReportTable({ reportType }) {
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [accountNo, setAccountNo] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const rowsPerPage = 10;

    useEffect(() => {

        if (reportType === "tds") {
            setRows([]);
            setAccountNo("");
            return;
        }

        axios
            .get(`http://127.0.0.1:8000/generate-report?table=${reportType}`)
            .then(res => {
                setRows(res.data);
                setCurrentPage(1);
                setSearchTerm("");
                setStartDate("");
                setEndDate("");
            })
            .catch(() => setRows([]));
    }, [reportType]);

    // --- EXPORT LOGIC ---
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, `${reportType}_report.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text(`${reportType.toUpperCase()} Report`, 14, 15);

        const tableColumn = Object.keys(rows[0]);
        const tableRows = filteredRows.map(row => Object.values(row));

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8 },
        });
        doc.save(`${reportType}_report.pdf`);
    };

    if (!rows.length && reportType !== "tds") {
        return <div className="report-area" style={{ padding: '50px', textAlign: 'center', color: '#94a3b8' }}>No data available</div>;
    }

    const isChart = reportType === "bank" || reportType === "loan";

    const formatHeader = (key) => {
        if (reportType !== "tds") return key;
        return key.replace(/COD_|DAT_|BAL_|AMT_|RAT_/g, '').replace(/_/g, ' ');
    };

    const filteredRows = rows.filter((row) => {
        const matchesSearch = Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

        const dateKey = Object.keys(row).find(k =>
            k.toLowerCase().includes("date") || k.toLowerCase().includes("dat_")
        );

        let matchesDate = true;
        if (dateKey && row[dateKey]) {
            const rowDate = new Date(row[dateKey]);
            if (startDate) matchesDate = matchesDate && rowDate >= new Date(startDate);
            if (endDate) matchesDate = matchesDate && rowDate <= new Date(endDate);
        }
        return matchesSearch && matchesDate;
    });

    const searchTdsByAccount = async () => {
        if (!accountNo.trim()) {
            alert("Please enter an account number.");
            return;
        }
        setIsSearching(true);
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/generate-report",
                {
                    params: {
                        table: "tds",
                        account_no: accountNo
                }
            }
        );
        setRows(res.data);
        setCurrentPage(1);
        } catch (error) {
            setRows([]);
        } finally {
            setIsSearching(false);
        }
    };

    const columns = rows.length ? Object.keys(rows[0]) : [];
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    return (
        <div className="report-area" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {reportType === "tds" && (
                <FilterPanel
                    value={accountNo}
                    onChange={setAccountNo}
                    onSearch={searchTdsByAccount}
                    loading={isSearching}
                    placeholder="Enter Account Number"
                />
                )}
            {!isChart && reportType !== "tds" && (
                <div style={{ display: 'flex', padding: '16px 24px', gap: '15px', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ position: 'relative', flex: 2 }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
                        <input
                            type="text"
                            placeholder={`Search records...`}
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                        />
                    </div>

                    {/* Date Filters */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    </div>

                    {/* Export Buttons Section */}
                    <div style={{ display: 'flex', gap: '8px', borderLeft: '1px solid #e2e8f0', paddingLeft: '15px' }}>
                        <button onClick={exportToExcel} title="Download Excel" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' }}>
                            📊
                        </button>
                        <button onClick={exportToPDF} title="Download PDF" style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' }}>
                            📄
                        </button>
                    </div>
                </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {reportType === "bank" ? <BankPieChart data={rows} /> :
                    reportType === "loan" ? <LoanBarChart data={rows} /> : (
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#4b82b9ff', zIndex: 10 }}>
                                <tr>
                                    {columns.map(col => (
                                        <th key={col} style={{ padding: '14px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#ffffffff', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>
                                            {formatHeader(col)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        {columns.map(col => (
                                            <td key={col} style={{ padding: '14px 24px', fontSize: '14px', color: '#334155' }}>
                                                {(typeof row[col] === 'number' && (col.includes('BAL') || col.includes('AMT')))
                                                    ? row[col].toLocaleString(undefined, { minimumFractionDigits: 2 })
                                                    : row[col]
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
            </div>

            {/* Pagination remains the same */}
            {!isChart && filteredRows.length > rowsPerPage && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#fff' }}>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                        Showing <strong>{indexOfFirstRow + 1}</strong> to <strong>{Math.min(indexOfLastRow, filteredRows.length)}</strong> of {filteredRows.length}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}