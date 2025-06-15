import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { BrowserRouter } from "react-router";
import { createTheme, MantineProvider, DEFAULT_THEME } from "@mantine/core";

// import "./FONTS/fonts.css";

const theme = createTheme({
  colors: { "f1-red": ["#ffeaec", "#fcd4d7", "#f4a7ac", "#ec777e", "#e64f57", "#e3353f", "#e22732", "#c91a25", "#b41220", "#9e0419"] },
  primaryColor: "f1-red",
  autoContrast: true,
  fontFamily: "Kanit, sans-serif",
  headings: { fontFamily: `Kanit, ${DEFAULT_THEME.fontFamily} ` },
});

createRoot(document.getElementById("root")).render(
  <MantineProvider theme={theme} defaultColorScheme="dark" withGlobalClasses withCssVariables>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </MantineProvider>
);
