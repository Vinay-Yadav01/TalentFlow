import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

function MSWErrorFallback({ error, onRetry }) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Service Initialization Error
          </h1>
          <p className="text-gray-600 mb-6">
            There was an error loading the demo data service. This is likely a
            browser compatibility issue with Service Workers.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Retrying..." : "Try Again"}
            </button>
            <p className="text-sm text-gray-500">
              If the issue persists, try refreshing the page or using a
              different browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MSWErrorFallback;
