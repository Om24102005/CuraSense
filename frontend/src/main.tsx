import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter/wght.css";   // ships with the app: no font download, so text never waits (also works offline)
import App from "./app/App.tsx";
import "./styles/index.css";
import { watchFrames } from "./app/animations/frameRate";
import { initNative } from "./app/native";
import { AppSettingsProvider } from "./app/state/AppSettingsContext";
import { ErrorBoundary } from "./app/components/shared/ErrorBoundary";
import "./app/services/api/client";   // points the shared API client at this site's API address and token before anything calls it

watchFrames();   // the screen's real refresh rate, and a watchdog for frames the page cannot keep up with
initNative();    // iPhone / Android app only: system bars, splash screen, back button (does nothing in a browser)

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AppSettingsProvider>
      <App />
    </AppSettingsProvider>
  </ErrorBoundary>
);
