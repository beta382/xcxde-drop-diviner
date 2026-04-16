import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "~/App";
import "~/ui/common/i18n";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
