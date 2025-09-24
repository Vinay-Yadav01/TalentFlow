import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import MSWErrorFallback from "./components/MSWErrorFallback.jsx";
import "./index.css";

let mswFailed = false;

// Start MSW
async function enableMocking() {
  // Enable MSW in both development and production for this demo app
  // In a real app, you would only enable this in development
  if (typeof window !== "undefined") {
    try {
      const { worker } = await import("./mocks/browser");
      await worker.start({
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
        onUnhandledRequest: "bypass",
        quiet: false, // Enable logging to help with debugging
      });
      console.log("🔄 MSW is running in", import.meta.env.MODE, "mode");
      return worker;
    } catch (error) {
      console.error("❌ Failed to start MSW:", error);
      console.error("This might be because the service worker isn't available");
      mswFailed = true;
      throw error;
    }
  }
}

function renderApp() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

function renderErrorFallback() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <MSWErrorFallback
        error={new Error("MSW failed to start")}
        onRetry={() => window.location.reload()}
      />
    </React.StrictMode>
  );
}

enableMocking()
  .then(() => {
    console.log("✅ MSW started successfully, rendering app...");
    renderApp();
  })
  .catch((error) => {
    console.error("❌ Failed to start MSW:", error);
    console.warn("⚠️ Rendering app without MSW - API calls may fail");
    // Still render the app - let the components handle the API errors
    renderApp();
  });
