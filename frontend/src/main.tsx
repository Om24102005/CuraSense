import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { AppSettingsProvider } from "./app/state/AppSettingsContext";
import { ErrorBoundary } from "./app/components/shared/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AppSettingsProvider>
      <App />
    </AppSettingsProvider>
  </ErrorBoundary>
);
