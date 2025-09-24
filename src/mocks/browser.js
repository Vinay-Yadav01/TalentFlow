import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// Log all unhandled requests to debug
worker.events.on("request:start", ({ request }) => {
  console.log("MSW: Intercepted request to", request.url);
});

worker.events.on("request:match", ({ request }) => {
  console.log("MSW: Matched request to", request.url);
});

worker.events.on("request:unhandled", ({ request }) => {
  console.warn("MSW: Unhandled request to", request.url);
});

export async function initMSW() {
  if (typeof window === "undefined" || process.env.NODE_ENV === "test") {
    console.log("MSW: Skipping in test/SSR environment");
    return;
  }

  try {
    console.log("MSW: Starting service worker...");

    await worker.start({
      onUnhandledRequest: "warn",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });

    console.log("MSW: Service worker started successfully");
  } catch (error) {
    console.error("MSW: Failed to start service worker:", error);
  }
}
