import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { JobProvider } from "./context/JobContext";
import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <FilterProvider>
            <App />
          </FilterProvider>
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
