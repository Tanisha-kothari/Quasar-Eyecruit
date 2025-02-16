import React, { useState, useEffect } from "react";
import "./App.css"; // Ensure you have the CSS file
import loaderGif from "../assets/loading.gif"; // Place the GIF in the public folder or src
import Home from "./page"

const MainPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      {loading ? (
        <div className="loader-container">
          <img src={loaderGif} alt="Loading..." className="loader" />
        </div>
      ) : (
        <div className="content">
          <Home/>
        </div>
      )}
    </div>
  );
};


export default MainPage;