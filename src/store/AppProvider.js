import React, { useState } from "react";
import appContext from "./app-context.js";

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (event, input) => {
    event.preventDefault();

    const query = input.value.trim();
    if (!query) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result = await response.json();
      setResults(result.results);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };

  const appContextValue = {
    loading,
    results,
    error,
    hasSearched,
    handleSubmit,
  };
  return (
    <appContext.Provider value={appContextValue}>
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
