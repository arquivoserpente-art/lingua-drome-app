import React from "react";
import { createRoot } from "react-dom/client";
import DromeSite from "./DromeSite";
import "./index.css"; // <-- IMPORTANTE: ativa o Tailwind
createRoot(document.getElementById("root")).render(<DromeSite />);
