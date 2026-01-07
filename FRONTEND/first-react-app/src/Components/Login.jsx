import { useState } from "react";

export default function Login({ onLoginSuccess }) {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Replace this with your actual API call to FastAPI
        if (credentials.email === "admin@example.com" && credentials.password === "password123") {
            onLoginSuccess();
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Please enter your details to sign in</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            required
                            style={styles.input}
                            placeholder="admin@example.com"
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            required
                            style={styles.input}
                            placeholder="••••••••"
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" style={styles.button}>Sign In</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
    card: {
        background: "#fff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
    },
    title: { fontSize: "24px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" },
    subtitle: { color: "#64748b", fontSize: "14px", marginBottom: "24px" },
    error: { background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "8px", fontSize: "12px", marginBottom: "16px" },
    form: { display: "flex", flexDirection: "column", gap: "20px" },
    inputGroup: { textAlign: "left" },
    label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px", textTransform: "uppercase" },
    input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" },
    button: { padding: "12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "0.3s" }
};
