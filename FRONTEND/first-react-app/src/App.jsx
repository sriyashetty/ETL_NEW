import { useState } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Sidebar";
import ReportTable from "./Components/ReportTable";
import Login from "./Components/Login";

function App() {
  const [reportType, setReportType] = useState("sales");
  // it will state to track if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // If it is not authenticated it will only show  the login screen
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }


  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <div className="main-layout">
        <Sidebar onSelect={setReportType} />
        <ReportTable reportType={reportType} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
