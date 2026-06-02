import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import {
    ConfigProvider,
    theme
} from "antd";

import {
    ThemeProvider,
    useTheme
} from "./context/ThemeContext";

function AntThemeWrapper() {
    const { theme: currentTheme } = useTheme();
    return (
        <ConfigProvider
            theme={{
                algorithm:
                    currentTheme === "dark"
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm
            }}
        >
            <App />
        </ConfigProvider>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <AntThemeWrapper />
        </ThemeProvider>
    </StrictMode>
)
