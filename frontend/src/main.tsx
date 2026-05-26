import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { AppSettingsProvider } from "./app/contexts/AppSettingsContext";

createRoot(document.getElementById("root")!).render(
  <AppSettingsProvider>
    <App />
  </AppSettingsProvider>
);
