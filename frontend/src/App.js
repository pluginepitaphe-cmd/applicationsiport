import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [message, setMessage] = useState("");
  const [statusChecks, setStatusChecks] = useState([]);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApiStatus = async () => {
    try {
      const response = await axios.get(`${API}/`);
      setMessage(response.data.message);
      console.log("API Response:", response.data);
    } catch (e) {
      console.error("Error fetching API status:", e);
      setError("Failed to connect to backend API");
    }
  };

  const fetchStatusChecks = async () => {
    try {
      const response = await axios.get(`${API}/status`);
      setStatusChecks(response.data);
      console.log("Status checks:", response.data);
    } catch (e) {
      console.error("Error fetching status checks:", e);
      setError("Failed to fetch status checks");
    }
  };

  const createStatusCheck = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API}/status`, {
        client_name: clientName
      });
      console.log("Status check created:", response.data);
      setClientName("");
      await fetchStatusChecks(); // Refresh the list
    } catch (e) {
      console.error("Error creating status check:", e);
      setError("Failed to create status check");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiStatus();
    fetchStatusChecks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="App-header bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <a
            className="App-link inline-block mb-4"
            href="https://emergent.sh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" 
              alt="Emergent Logo"
              className="w-24 h-24 mx-auto rounded-full"
            />
          </a>
          <h1 className="text-2xl font-bold mb-2">SiportApplication</h1>
          <p className="text-lg">Building something incredible ~!</p>
          <p className="text-sm mt-2 opacity-75">
            Backend Status: <span className="font-semibold">{message || "Connecting..."}</span>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Status Check Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Status Check</h2>
          <form onSubmit={createStatusCheck} className="flex gap-4">
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !clientName.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </div>

        {/* Status Checks List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Status Checks ({statusChecks.length})</h2>
          {statusChecks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No status checks yet. Create one above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Client Name</th>
                    <th className="px-4 py-2 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {statusChecks.map((check, index) => (
                    <tr key={check.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-4 py-2 font-mono text-sm">{check.id.substring(0, 8)}...</td>
                      <td className="px-4 py-2">{check.client_name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(check.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;