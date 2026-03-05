import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./index.css";
import App from "./App.jsx";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#2563eb",
        },
        secondary: {
            main: "#0d9488",
        },
        background: {
            default: "#f1f5f9",
            paper: "#ffffff",
        },
        text: {
            primary: "#0f172a",
            secondary: "#475569",
        },
    },
    typography: {
        fontFamily: "'Nunito Sans', 'Segoe UI', sans-serif",
        h3: {
            fontWeight: 700,
            letterSpacing: "-0.02em",
        },
        h4: {
            fontWeight: 700,
            letterSpacing: "-0.01em",
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 18,
                },
            },
        },
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
